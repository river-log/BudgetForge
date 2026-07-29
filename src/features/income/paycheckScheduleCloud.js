export function toPaycheckScheduleRow(schedule, userId) {
  return {
    id: schedule.id, user_id: userId, employer: schedule.employer, source_name: schedule.sourceName || schedule.employer,
    pay_frequency: schedule.payFrequency, preferred_weekday: schedule.preferredWeekday, anchor_date: schedule.anchorDate,
    semimonthly_pattern: schedule.semimonthlyPattern, semimonthly_day_one: schedule.semimonthlyDayOne,
    semimonthly_day_two: schedule.semimonthlyDayTwo, monthly_day: schedule.monthlyDay,
    use_last_day_of_month: Boolean(schedule.useLastDayOfMonth), default_hourly_rate: schedule.defaultHourlyRate,
    default_regular_hours: schedule.defaultRegularHours, default_overtime_hours: schedule.defaultOvertimeHours,
    default_overtime_multiplier: schedule.defaultOvertimeMultiplier, default_gross_pay: schedule.defaultGrossPay,
    default_deductions: schedule.defaultDeductions, default_deposit_method: schedule.defaultDepositMethod || null,
    next_expected_pay_date: schedule.nextExpectedPayDate, is_active: schedule.isActive !== false,
    created_at: schedule.createdAt, updated_at: schedule.updatedAt,
  };
}
