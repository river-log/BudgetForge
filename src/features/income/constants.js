export const INCOME_STORAGE_KEY = "budgetforge-income-entries-v1";
export const INCOME_MODE_STORAGE_KEY = "budgetforge-income-mode-v1";
export const PAYCHECK_SCHEDULES_STORAGE_KEY = "budgetforge-paycheck-schedules-v1";

export const PAY_FREQUENCIES = Object.freeze([
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 Weeks" },
  { value: "semimonthly", label: "Twice a Month" },
  { value: "monthly", label: "Monthly" },
  { value: "irregular", label: "Irregular" },
  { value: "one-time", label: "One-time" },
]);
export const PAY_FREQUENCY_VALUES = PAY_FREQUENCIES.map(({ value }) => value);
export const PAY_FREQUENCY_LABELS = Object.fromEntries(PAY_FREQUENCIES.map(({ value, label }) => [value, label]));

export const INCOME_SOURCE_TYPES = [
  "Paycheck", "Salary", "Bonus", "Overtime", "Tips", "Commission", "Gift",
  "Friends / Family", "Refund", "Tax Refund", "Side Hustle", "Cash", "Sale",
  "Investment", "Other",
];

export const DEPOSIT_METHODS = [
  "Direct Deposit", "Cash", "Check", "Cash App", "Venmo", "PayPal", "Zelle",
  "Bank Transfer", "Other",
];
