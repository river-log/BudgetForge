import { DEPOSIT_METHODS, INCOME_SOURCE_TYPES } from "./constants";

export const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
export const nonNegative = (value) => Math.max(0, Number(value) || 0);
export const formatIncomeCurrency = (value) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value) || 0);

export function calculatePaycheck(values) {
  const hourlyRate = nonNegative(values.hourlyRate);
  const regularHours = nonNegative(values.regularHours);
  const overtimeHours = nonNegative(values.overtimeHours);
  const overtimeMultiplier = nonNegative(values.overtimeMultiplier || 1.5);
  const regularPay = roundMoney(hourlyRate * regularHours);
  const overtimePay = roundMoney(hourlyRate * overtimeMultiplier * overtimeHours);
  const estimatedGrossPay = roundMoney(regularPay + overtimePay);
  const deductionFields = ["federalTax", "stateTax", "localTax", "socialSecurityTax", "medicareTax", "healthInsurance", "retirementContribution", "otherDeductions"];
  const totalDeductions = roundMoney(deductionFields.reduce((sum, field) => sum + nonNegative(values[field]), 0));
  const grossPay = roundMoney(values.grossPay === "" || values.grossPay === undefined ? estimatedGrossPay : nonNegative(values.grossPay));
  return { regularPay, overtimePay, estimatedGrossPay, grossPay, totalDeductions, netPay: roundMoney(grossPay - totalDeductions) };
}

export function validateIncome(values) {
  const errors = {};
  if (!["quick", "paycheck"].includes(values.entryMode)) errors.entryMode = "Choose an entry mode.";
  if (!INCOME_SOURCE_TYPES.includes(values.sourceType)) errors.sourceType = "Choose a source type.";
  if (!String(values.sourceName || values.employer || "").trim()) errors.sourceName = values.entryMode === "paycheck" ? "Employer is required." : "Source name is required.";
  if (!DEPOSIT_METHODS.includes(values.depositMethod)) errors.depositMethod = "Choose a deposit method.";
  if (!values.dateReceived || Number.isNaN(Date.parse(`${values.dateReceived}T12:00:00`))) errors.dateReceived = "Enter a valid received date.";
  const numericFields = values.entryMode === "paycheck"
    ? ["hourlyRate", "regularHours", "overtimeHours", "overtimeMultiplier", "grossPay", "federalTax", "stateTax", "localTax", "socialSecurityTax", "medicareTax", "healthInsurance", "retirementContribution", "otherDeductions"]
    : ["amount"];
  numericFields.forEach((field) => {
    if (values[field] !== "" && Number(values[field]) < 0) errors[field] = "Value cannot be negative.";
  });
  if (values.entryMode === "quick" && !(Number(values.amount) > 0)) errors.amount = "Amount must be greater than zero.";
  if (values.entryMode === "paycheck") {
    if (!values.payPeriodStart) errors.payPeriodStart = "Pay period start is required.";
    if (!values.payPeriodEnd) errors.payPeriodEnd = "Pay period end is required.";
    if (values.payPeriodStart && values.payPeriodEnd && values.payPeriodEnd < values.payPeriodStart) errors.payPeriodEnd = "Pay period end cannot be before the start.";
    if (calculatePaycheck(values).netPay < 0) errors.grossPay = "Deductions cannot exceed gross pay.";
  }
  return errors;
}

export function normalizeIncomeEntry(values, { id = crypto.randomUUID(), userId = null, now = new Date().toISOString(), createdAt = now } = {}) {
  const core = {
    id, userId, entryMode: values.entryMode, sourceType: values.entryMode === "paycheck" ? (values.sourceType || "Paycheck") : values.sourceType,
    sourceName: String(values.entryMode === "paycheck" ? values.employer : values.sourceName).trim(),
    amount: roundMoney(values.entryMode === "paycheck" ? calculatePaycheck(values).netPay : values.amount),
    dateReceived: values.dateReceived, depositMethod: values.depositMethod, notes: String(values.notes || "").trim(),
    createdAt, updatedAt: now,
  };
  if (values.entryMode === "quick") return core;
  const calculated = calculatePaycheck(values);
  const fields = ["hourlyRate", "regularHours", "overtimeHours", "overtimeMultiplier", "federalTax", "stateTax", "localTax", "socialSecurityTax", "medicareTax", "healthInsurance", "retirementContribution", "otherDeductions"];
  return {
    ...core, employer: String(values.employer).trim(), payPeriodStart: values.payPeriodStart, payPeriodEnd: values.payPeriodEnd,
    ...Object.fromEntries(fields.map((field) => [field, roundMoney(nonNegative(values[field]))])),
    grossPay: calculated.grossPay, totalDeductions: calculated.totalDeductions, netPay: calculated.netPay,
  };
}

export function incomeSummary(entries, now = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const valid = entries.filter((entry) => entry && Number.isFinite(Number(entry.amount)) && !Number.isNaN(Date.parse(`${entry.dateReceived}T12:00:00`)));
  const thisMonth = valid.filter((entry) => { const date = new Date(`${entry.dateReceived}T12:00:00`); return date.getFullYear() === year && date.getMonth() === month; });
  const thisYear = valid.filter((entry) => new Date(`${entry.dateReceived}T12:00:00`).getFullYear() === year);
  const paychecks = valid.filter((entry) => entry.entryMode === "paycheck");
  const sum = (items) => roundMoney(items.reduce((total, entry) => total + Number(entry.amount), 0));
  return {
    monthIncome: sum(thisMonth), yearIncome: sum(thisYear), monthCount: thisMonth.length,
    averagePaycheck: paychecks.length ? roundMoney(sum(paychecks) / paychecks.length) : 0,
    largestIncome: valid.length ? Math.max(...valid.map((entry) => Number(entry.amount))) : 0,
  };
}

export function resolveMonthlyIncome(manualIncome, entries, mode, now = new Date()) {
  return mode === "tracked" ? incomeSummary(entries, now).monthIncome : nonNegative(manualIncome);
}

export function filterIncome(entries, filters = {}) {
  const query = String(filters.query || "").trim().toLowerCase();
  return entries.filter((entry) => {
    const date = new Date(`${entry.dateReceived}T12:00:00`);
    return (!query || [entry.sourceName, entry.employer, entry.notes].some((value) => String(value || "").toLowerCase().includes(query)))
      && (!filters.sourceType || entry.sourceType === filters.sourceType)
      && (!filters.entryMode || entry.entryMode === filters.entryMode)
      && (!filters.depositMethod || entry.depositMethod === filters.depositMethod)
      && (!filters.month || date.getMonth() + 1 === Number(filters.month))
      && (!filters.year || date.getFullYear() === Number(filters.year));
  }).sort((a, b) => {
    if (filters.sort === "oldest") return a.dateReceived.localeCompare(b.dateReceived);
    if (filters.sort === "highest") return Number(b.amount) - Number(a.amount);
    if (filters.sort === "lowest") return Number(a.amount) - Number(b.amount);
    return b.dateReceived.localeCompare(a.dateReceived);
  });
}

export function monthlyIncomeSeries(entries) {
  const totals = {};
  entries.forEach((entry) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.dateReceived || "")) return;
    const key = entry.dateReceived.slice(0, 7);
    totals[key] = roundMoney((totals[key] || 0) + nonNegative(entry.amount));
  });
  return totals;
}
