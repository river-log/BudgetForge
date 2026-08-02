import { isPaidForMonth } from "./billPayments";
import { getHighestInterestDebt } from "./financialInsights";

function amount(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.round(number * 100) / 100 : 0;
}

function records(value) {
  return Array.isArray(value) ? value : [];
}

export function calculateFinancialSummary({ monthlyIncome = 0, bills = [], savingsGoals = [], debts = [] } = {}) {
  const income = amount(monthlyIncome);
  const totalBills = records(bills).reduce((sum, bill) => sum + amount(bill?.amount), 0);
  const totalSavings = records(savingsGoals).reduce((sum, goal) => sum + amount(goal?.saved), 0);
  const totalDebt = records(debts).reduce((sum, debt) => sum + amount(debt?.balance), 0);
  return { monthlyIncome: income, totalBills, totalSavings, totalDebt, remainingCashFlow: Math.round((income - totalBills) * 100) / 100 };
}

export function calculateNetWorth(savingsGoals = [], debts = []) {
  const { totalSavings, totalDebt } = calculateFinancialSummary({ savingsGoals, debts });
  const netWorth = Math.round((totalSavings - totalDebt) * 100) / 100;
  return { netWorth, totalSavings, totalDebt, status: netWorth > 0 ? "Positive" : netWorth < 0 ? "Negative" : "Balanced" };
}

export function calculateSavingsReport(savingsGoals = []) {
  const goals = records(savingsGoals).map((goal) => ({ ...goal, saved: amount(goal?.saved), target: amount(goal?.target) }));
  const validGoals = goals.filter((goal) => goal.target > 0);
  const completionTotal = validGoals.reduce((sum, goal) => sum + Math.min(100, (goal.saved / goal.target) * 100), 0);
  return {
    totalSaved: goals.reduce((sum, goal) => sum + goal.saved, 0),
    goalCount: goals.length,
    averageCompletion: validGoals.length ? completionTotal / validGoals.length : 0,
    completedGoals: validGoals.filter((goal) => goal.saved >= goal.target).length,
  };
}

export function calculateDebtReport(debts = []) {
  const activeDebts = records(debts).filter((debt) => amount(debt?.balance) > 0);
  const highestAprAccount = getHighestInterestDebt(activeDebts);
  return {
    totalDebt: activeDebts.reduce((sum, debt) => sum + amount(debt.balance), 0),
    minimumPayments: activeDebts.reduce((sum, debt) => sum + amount(debt.minimum), 0),
    averageApr: activeDebts.length ? activeDebts.reduce((sum, debt) => sum + amount(debt.apr), 0) / activeDebts.length : 0,
    highestAprAccount,
    accountCount: activeDebts.length,
  };
}

export function calculateMonthlySpending(bills = [], date = new Date()) {
  const normalized = records(bills).map((bill) => ({ ...bill, amount: amount(bill?.amount) }));
  const paid = normalized.filter((bill) => isPaidForMonth(bill, date));
  const unpaid = normalized.filter((bill) => !isPaidForMonth(bill, date));
  const categories = Object.entries(normalized.reduce((totals, bill) => {
    const category = String(bill.category || "Other").trim() || "Other";
    totals[category] = (totals[category] || 0) + bill.amount;
    return totals;
  }, {})).map(([category, total]) => ({ category, total: Math.round(total * 100) / 100 })).sort((left, right) => right.total - left.total);
  const largestBill = [...normalized].sort((left, right) => right.amount - left.amount)[0] || null;
  return {
    totalPaidBills: paid.reduce((sum, bill) => sum + bill.amount, 0),
    totalUnpaidBills: unpaid.reduce((sum, bill) => sum + bill.amount, 0),
    paidCount: paid.length,
    unpaidCount: unpaid.length,
    largestBill,
    categories,
  };
}

export function createFinancialReport(data = {}, now = new Date()) {
  return {
    application: "BudgetForge",
    reportVersion: 1,
    generatedAt: now.toISOString(),
    report: {
      financialSummary: calculateFinancialSummary(data),
      netWorth: calculateNetWorth(data.savingsGoals, data.debts),
      savings: calculateSavingsReport(data.savingsGoals),
      debt: calculateDebtReport(data.debts),
      monthlySpending: calculateMonthlySpending(data.bills, now),
    },
  };
}
