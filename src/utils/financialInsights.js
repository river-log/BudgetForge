import { isPaidForMonth } from "./billPayments";
import { parseStoredDate, recurringStoredDate } from "./storedDates";

const DAY_MS = 86400000;

function finiteNonNegative(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function startOfDay(value) {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

function nextMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1, 12);
}

function billOccurrence(bill, now) {
  const currentDate = recurringStoredDate(bill?.dueDate, now);
  const currentOccurrence = parseStoredDate(currentDate);
  if (!currentOccurrence) return null;
  if (!isPaidForMonth(bill, now)) return currentOccurrence;
  const followingMonth = nextMonth(now);
  if (isPaidForMonth(bill, followingMonth)) return null;
  return parseStoredDate(recurringStoredDate(bill.dueDate, followingMonth));
}

/** Returns unpaid recurring bill occurrences that are overdue or due in seven days. */
export function getBillsDueSoon(bills = [], now = new Date()) {
  const today = startOfDay(now);
  const items = (Array.isArray(bills) ? bills : [])
    .map((bill) => {
      const dueDate = billOccurrence(bill, today);
      if (!dueDate) return null;
      const daysUntilDue = Math.round((startOfDay(dueDate) - today) / DAY_MS);
      if (daysUntilDue > 7) return null;
      return { ...bill, dueDate: recurringStoredDate(bill.dueDate, dueDate), daysUntilDue, overdue: daysUntilDue < 0 };
    })
    .filter(Boolean)
    .sort((left, right) => left.daysUntilDue - right.daysUntilDue);

  return {
    items,
    overdue: items.filter((bill) => bill.overdue),
    dueSoon: items.filter((bill) => !bill.overdue),
  };
}

export function getHighestInterestDebt(debts = []) {
  return (Array.isArray(debts) ? debts : [])
    .filter((debt) => finiteNonNegative(debt?.balance) > 0)
    .map((debt) => ({ ...debt, balance: finiteNonNegative(debt.balance), apr: finiteNonNegative(debt.apr), minimum: finiteNonNegative(debt.minimum) }))
    .sort((left, right) => right.apr - left.apr || right.balance - left.balance)[0] || null;
}

export function getClosestSavingsGoal(goals = []) {
  const normalized = (Array.isArray(goals) ? goals : [])
    .map((goal) => ({ ...goal, target: finiteNonNegative(goal?.target), saved: finiteNonNegative(goal?.saved) }))
    .filter((goal) => goal.target > 0);
  const incomplete = normalized
    .filter((goal) => goal.saved < goal.target)
    .map((goal) => ({ ...goal, percentage: Math.min(100, (goal.saved / goal.target) * 100) }))
    .sort((left, right) => right.percentage - left.percentage || right.saved - left.saved);
  return {
    goal: incomplete[0] || null,
    allComplete: normalized.length > 0 && incomplete.length === 0,
    hasGoals: normalized.length > 0,
  };
}

/**
 * Calculates a deterministic 0-100 score from four weighted factors:
 * unpaid commitments (35%), overdue bills (25%), savings progress (20%),
 * and the share of debt balances carrying at least 15% APR (20%).
 */
export function calculateFinancialHealth({ bills = [], savingsGoals = [], debts = [], monthlyIncome = 0, now = new Date() } = {}) {
  const income = finiteNonNegative(monthlyIncome);
  const currentBills = (Array.isArray(bills) ? bills : []).filter((bill) => !isPaidForMonth(bill, now));
  const unpaidCommitments = currentBills.reduce((sum, bill) => sum + finiteNonNegative(bill?.amount), 0);
  const overdueCount = getBillsDueSoon(currentBills, now).overdue.length;
  const validGoals = (Array.isArray(savingsGoals) ? savingsGoals : []).filter((goal) => finiteNonNegative(goal?.target) > 0);
  const totalTarget = validGoals.reduce((sum, goal) => sum + finiteNonNegative(goal.target), 0);
  const totalSaved = validGoals.reduce((sum, goal) => sum + Math.min(finiteNonNegative(goal.saved), finiteNonNegative(goal.target)), 0);
  const activeDebts = (Array.isArray(debts) ? debts : []).filter((debt) => finiteNonNegative(debt?.balance) > 0);
  const totalDebt = activeDebts.reduce((sum, debt) => sum + finiteNonNegative(debt.balance), 0);
  const highInterestDebt = activeDebts.filter((debt) => finiteNonNegative(debt.apr) >= 15).reduce((sum, debt) => sum + finiteNonNegative(debt.balance), 0);

  const factors = [
    { id: "commitments", label: "Unpaid bill commitments", score: unpaidCommitments === 0 ? 100 : income > 0 ? Math.max(0, 100 - (unpaidCommitments / income) * 100) : 0, weight: 0.35 },
    { id: "overdue", label: "On-time bills", score: Math.max(0, 100 - overdueCount * 25), weight: 0.25 },
    { id: "savings", label: "Savings progress", score: totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 50, weight: 0.20 },
    { id: "debt", label: "Lower-interest debt exposure", score: totalDebt > 0 ? Math.max(0, 100 - (highInterestDebt / totalDebt) * 100) : 100, weight: 0.20 },
  ].map((factor) => ({ ...factor, score: Math.round(factor.score) }));

  const score = Math.round(factors.reduce((sum, factor) => sum + factor.score * factor.weight, 0));
  const strongest = [...factors].sort((left, right) => right.score - left.score)[0];
  const weakest = [...factors].sort((left, right) => left.score - right.score)[0];
  const status = score >= 85 ? "Excellent" : score >= 70 ? "Good" : score >= 50 ? "Fair" : "Needs Attention";
  return { score, status, strongest, weakest, factors, unpaidCommitments, overdueCount };
}

export function getSuggestedNextAction({ bills = [], debts = [], savingsGoals = [], now = new Date() } = {}) {
  const billTiming = getBillsDueSoon(bills, now);
  if (billTiming.overdue.length) {
    const bill = billTiming.overdue[0];
    return { type: "overdue", title: `Review overdue bill: ${bill.name}`, description: `Confirm or record the ${formatInsightCurrency(bill.amount)} payment.`, route: "/bills" };
  }
  if (billTiming.dueSoon.length) {
    const bill = billTiming.dueSoon[0];
    return { type: "due-soon", title: `Prepare for ${bill.name}`, description: `${formatInsightCurrency(bill.amount)} is due ${bill.daysUntilDue === 0 ? "today" : `in ${bill.daysUntilDue} days`}.`, route: "/bills" };
  }
  const debt = getHighestInterestDebt(debts);
  if (debt) return { type: "debt", title: `Review ${debt.name}`, description: `It has the highest recorded APR at ${formatPercent(debt.apr)}.`, route: "/debt" };
  const savings = getClosestSavingsGoal(savingsGoals).goal;
  if (savings) return { type: "savings", title: `Continue ${savings.name}`, description: `${formatInsightCurrency(Math.max(0, savings.target - savings.saved))} remains to reach the target.`, route: "/savings" };
  return { type: "onboarding", title: "Build your financial workspace", description: "Add income and a bill to begin seeing personalized dashboard insights.", route: "/bills" };
}

export function formatInsightCurrency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(finiteNonNegative(value));
}

export function formatPercent(value) {
  return `${finiteNonNegative(value).toLocaleString("en-US", { maximumFractionDigits: 2 })}%`;
}
