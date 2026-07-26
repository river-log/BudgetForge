import { isPaidForMonth, monthKey } from "./billPayments";

const asMoney = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 100) / 100 : 0;
};

export function calculateSavingsRate(saved, income) {
  const safeIncome = asMoney(income);
  return safeIncome > 0 ? (asMoney(saved) / safeIncome) * 100 : null;
}

export function calculateCategoryShares(categories = {}) {
  const entries = Object.entries(categories || {})
    .map(([category, amount]) => ({ category: category || "Other", amount: asMoney(amount) }))
    .filter((entry) => entry.amount > 0);
  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);

  return entries
    .map((entry) => ({ ...entry, share: total > 0 ? (entry.amount / total) * 100 : 0 }))
    .sort((left, right) => right.amount - left.amount);
}

export function calculatePercentageChange(current, previous) {
  const currentValue = asMoney(current);
  const previousValue = asMoney(previous);
  if (previousValue === 0) return currentValue === 0 ? 0 : null;
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
}

export function calculateMonthComparison(current, previous, key, label) {
  if (!previous || current?.[key] === null || previous?.[key] === null) return null;
  const currentValue = asMoney(current[key]);
  const previousValue = asMoney(previous[key]);
  const change = asMoney(currentValue - previousValue);

  return {
    key,
    label,
    current: currentValue,
    previous: previousValue,
    change,
    percentageChange: calculatePercentageChange(currentValue, previousValue),
    direction: change > 0 ? "increase" : change < 0 ? "decrease" : "same",
  };
}

/**
 * Builds a summary using live data only for the current month. Historical fields
 * remain null unless they are explicitly present in stored monthly history.
 */
export function calculateMonthlySummary({
  selectedMonth,
  currentMonth = monthKey(),
  bills = [],
  monthlyIncome = 0,
  budgetCategories = [],
  spendingHistory = {},
  savingsHistory = {},
}) {
  const isCurrentMonth = selectedMonth === currentMonth;
  const spending = spendingHistory?.[selectedMonth];
  const categories = calculateCategoryShares(spending?.categories);
  const paidBills = isCurrentMonth
    ? bills.filter((bill) => isPaidForMonth(bill, new Date(`${selectedMonth}-15T12:00:00`)))
    : [];
  const totalBills = isCurrentMonth
    ? asMoney(bills.reduce((sum, bill) => sum + asMoney(bill?.amount), 0))
    : null;
  const income = isCurrentMonth ? asMoney(monthlyIncome) : null;
  const budgetPlan = isCurrentMonth
    ? asMoney(budgetCategories.reduce((sum, category) => sum + asMoney(category?.amount), 0))
    : null;
  const paidAmount = spending ? asMoney(spending.total) : (isCurrentMonth ? 0 : null);
  const savingsBalance = Object.hasOwn(savingsHistory || {}, selectedMonth)
    ? asMoney(savingsHistory[selectedMonth])
    : null;

  return {
    month: selectedMonth,
    isCurrentMonth,
    income,
    totalBills,
    paidAmount,
    paidCount: isCurrentMonth ? paidBills.length : null,
    unpaidAmount: isCurrentMonth ? asMoney(totalBills - paidBills.reduce((sum, bill) => sum + asMoney(bill.amount), 0)) : null,
    unpaidCount: isCurrentMonth ? Math.max(0, bills.length - paidBills.length) : null,
    remainingIncome: income === null || totalBills === null ? null : asMoney(income - totalBills),
    savingsBalance,
    budgetUtilization: income > 0 ? ((totalBills + budgetPlan) / income) * 100 : null,
    largestCategory: categories[0] || null,
    categoryShares: categories,
  };
}

export function generateMonthlyInsights(summary, previousSummary) {
  if (!summary) return [];
  const candidates = [];

  if (summary.unpaidCount > 0) {
    candidates.push({ id: "unpaid", priority: 100, text: `${summary.unpaidCount} ${summary.unpaidCount === 1 ? "bill remains" : "bills remain"} unpaid.` });
  }
  if (summary.largestCategory) {
    candidates.push({
      id: "largest-category",
      priority: 90,
      text: `${summary.largestCategory.category} made up ${Math.round(summary.largestCategory.share)}% of paid bills this month.`,
    });
  }
  if (summary.income > 0 && summary.totalBills !== null) {
    candidates.push({
      id: "income-use",
      priority: 80,
      text: `Planned bills use ${Math.round((summary.totalBills / summary.income) * 100)}% of monthly income.`,
    });
  }
  if (summary.savingsBalance !== null) {
    candidates.push({
      id: "savings-balance",
      priority: 60,
      text: `Your recorded savings balance for this month is ${formatCurrency(summary.savingsBalance)}.`,
    });
  }

  const billsComparison = calculateMonthComparison(summary, previousSummary, "paidAmount", "Paid bills");
  if (billsComparison && billsComparison.change !== 0) {
    candidates.push({
      id: "paid-change",
      priority: 85,
      text: `Paid bills were ${formatCurrency(Math.abs(billsComparison.change))} ${billsComparison.change > 0 ? "higher" : "lower"} than last month.`,
    });
  }

  return candidates.sort((left, right) => right.priority - left.priority).slice(0, 5);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(asMoney(value));
}

export function previousMonthKey(key) {
  const [year, month] = String(key).split("-").map(Number);
  if (!year || !month) return null;
  return month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, "0")}`;
}

