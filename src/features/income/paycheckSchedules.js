import { calculatePaycheck, roundMoney } from "./income";
import { DEPOSIT_METHODS, PAY_FREQUENCY_VALUES } from "./constants";
import { isValidStoredDate, parseStoredDate } from "../../utils/storedDates";

const pad = (value) => String(value).padStart(2, "0");
const dateText = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const safeNumber = (value) => Number.isFinite(Number(value)) && Number(value) >= 0 ? Number(value) : 0;
const monthDate = (year, month, day) => new Date(year, month, Math.min(day, new Date(year, month + 1, 0).getDate()), 12);

export function validatePaycheckSchedule(values) {
  const errors = {};
  if (!String(values.employer || "").trim()) errors.employer = "Employer is required.";
  if (!PAY_FREQUENCY_VALUES.includes(String(values.payFrequency || "").trim())) errors.payFrequency = "Choose a valid pay frequency.";
  if (values.anchorDate && !isValidStoredDate(values.anchorDate)) errors.anchorDate = "Enter a valid anchor date.";
  if (values.preferredWeekday !== "" && values.preferredWeekday != null && (!Number.isInteger(Number(values.preferredWeekday)) || Number(values.preferredWeekday) < 0 || Number(values.preferredWeekday) > 6)) errors.preferredWeekday = "Choose a valid weekday.";
  if (values.payFrequency === "semimonthly") {
    if (!["first-fifteenth", "fifteenth-last", "custom"].includes(values.semimonthlyPattern)) errors.semimonthlyPattern = "Choose a schedule pattern.";
    if (values.semimonthlyPattern === "custom") {
      const one = Number(values.semimonthlyDayOne); const two = Number(values.semimonthlyDayTwo);
      if (!Number.isInteger(one) || one < 1 || one > 31) errors.semimonthlyDayOne = "Use a day from 1 through 31.";
      if (!Number.isInteger(two) || two < 1 || two > 31) errors.semimonthlyDayTwo = "Use a day from 1 through 31.";
      if (one === two) errors.semimonthlyDayTwo = "The two days must be different.";
    }
  }
  if (values.payFrequency === "monthly" && !values.useLastDayOfMonth) {
    const day = Number(values.monthlyDay);
    if (!Number.isInteger(day) || day < 1 || day > 31) errors.monthlyDay = "Use a day from 1 through 31.";
  }
  return errors;
}

export function normalizePaycheckSchedule(values, { id = crypto.randomUUID(), userId = null, now = new Date().toISOString(), createdAt = now } = {}) {
  const days = [Number(values.semimonthlyDayOne), Number(values.semimonthlyDayTwo)].sort((a, b) => a - b);
  return {
    id, userId, employer: String(values.employer || "").trim(), sourceName: String(values.sourceName || values.employer || "").trim(),
    payFrequency: PAY_FREQUENCY_VALUES.includes(values.payFrequency) ? values.payFrequency : "irregular",
    preferredWeekday: values.preferredWeekday === "" || values.preferredWeekday == null ? null : Number(values.preferredWeekday),
    anchorDate: isValidStoredDate(values.anchorDate) ? values.anchorDate : null,
    semimonthlyPattern: values.semimonthlyPattern || null,
    semimonthlyDayOne: Number.isInteger(days[0]) ? days[0] : null, semimonthlyDayTwo: Number.isInteger(days[1]) ? days[1] : null,
    monthlyDay: values.monthlyDay ? Number(values.monthlyDay) : null, useLastDayOfMonth: Boolean(values.useLastDayOfMonth),
    defaultHourlyRate: safeNumber(values.defaultHourlyRate), defaultRegularHours: safeNumber(values.defaultRegularHours),
    defaultOvertimeHours: safeNumber(values.defaultOvertimeHours), defaultOvertimeMultiplier: safeNumber(values.defaultOvertimeMultiplier || 1.5),
    defaultGrossPay: values.defaultGrossPay === "" ? null : safeNumber(values.defaultGrossPay),
    defaultDeductions: safeNumber(values.defaultDeductions),
    defaultDepositMethod: DEPOSIT_METHODS.includes(values.defaultDepositMethod) ? values.defaultDepositMethod : "",
    nextExpectedPayDate: isValidStoredDate(values.nextExpectedPayDate) ? values.nextExpectedPayDate : null,
    isActive: values.isActive !== false, createdAt, updatedAt: now,
  };
}

export function nextExpectedPayDate(schedule, afterDate = schedule?.nextExpectedPayDate || schedule?.anchorDate) {
  const after = parseStoredDate(afterDate);
  if (!after || !schedule || !schedule.isActive || ["irregular", "one-time"].includes(schedule.payFrequency)) return null;
  if (schedule.payFrequency === "weekly" || schedule.payFrequency === "biweekly") {
    const next = new Date(after); next.setDate(next.getDate() + (schedule.payFrequency === "weekly" ? 7 : 14)); return dateText(next);
  }
  if (schedule.payFrequency === "monthly") {
    const nextMonth = new Date(after.getFullYear(), after.getMonth() + 1, 1, 12);
    const day = schedule.useLastDayOfMonth ? new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate() : Number(schedule.monthlyDay);
    return day ? dateText(monthDate(nextMonth.getFullYear(), nextMonth.getMonth(), day)) : null;
  }
  const patternDays = schedule.semimonthlyPattern === "first-fifteenth" ? [1, 15]
    : schedule.semimonthlyPattern === "fifteenth-last" ? [15, new Date(after.getFullYear(), after.getMonth() + 1, 0).getDate()]
      : [Number(schedule.semimonthlyDayOne), Number(schedule.semimonthlyDayTwo)].filter((day) => day >= 1 && day <= 31).sort((a, b) => a - b);
  for (const day of patternDays) {
    const candidate = monthDate(after.getFullYear(), after.getMonth(), day);
    if (candidate > after) return dateText(candidate);
  }
  const nextMonth = new Date(after.getFullYear(), after.getMonth() + 1, 1, 12);
  if (!patternDays.length) return null;
  const first = schedule.semimonthlyPattern === "fifteenth-last" ? 15 : patternDays[0];
  return dateText(monthDate(nextMonth.getFullYear(), nextMonth.getMonth(), first));
}

export function estimatedSchedulePaycheck(schedule) {
  if (!schedule) return null;
  const result = calculatePaycheck({
    hourlyRate: schedule.defaultHourlyRate, regularHours: schedule.defaultRegularHours,
    overtimeHours: schedule.defaultOvertimeHours, overtimeMultiplier: schedule.defaultOvertimeMultiplier,
    grossPay: schedule.defaultGrossPay ?? "", otherDeductions: schedule.defaultDeductions,
  });
  return result.netPay > 0 ? result.netPay : null;
}

export function prefillPaycheckFromSchedule(schedule) {
  const dateReceived = schedule.nextExpectedPayDate || schedule.anchorDate || "";
  const periodDays = schedule.payFrequency === "weekly" ? 7 : schedule.payFrequency === "biweekly" ? 14 : null;
  const end = parseStoredDate(dateReceived);
  const start = end && periodDays ? new Date(end.getFullYear(), end.getMonth(), end.getDate() - periodDays + 1, 12) : null;
  return {
    entryMode: "paycheck", sourceType: "Paycheck", employer: schedule.employer, sourceName: schedule.employer,
    payFrequency: schedule.payFrequency, scheduleId: schedule.id, dateReceived,
    payPeriodStart: start ? dateText(start) : "", payPeriodEnd: end && periodDays ? dateText(end) : "",
    hourlyRate: schedule.defaultHourlyRate, regularHours: schedule.defaultRegularHours, overtimeHours: schedule.defaultOvertimeHours,
    overtimeMultiplier: schedule.defaultOvertimeMultiplier, grossPay: schedule.defaultGrossPay ?? "",
    otherDeductions: schedule.defaultDeductions, depositMethod: schedule.defaultDepositMethod,
  };
}

export function scheduleForecast(schedules, entries, month) {
  const received = roundMoney((Array.isArray(entries) ? entries : []).filter((entry) => entry.dateReceived?.startsWith(month)).reduce((sum, entry) => sum + safeNumber(entry.amount), 0));
  const active = (Array.isArray(schedules) ? schedules : []).filter((schedule) => schedule.isActive && schedule.nextExpectedPayDate?.startsWith(month));
  const expected = roundMoney(active.reduce((sum, schedule) => sum + (estimatedSchedulePaycheck(schedule) || 0), 0));
  return { received, expected, remainingExpected: Math.max(0, roundMoney(expected - received)), scheduledCount: active.length };
}
