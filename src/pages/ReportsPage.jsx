import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartNoAxesCombined, CircleDollarSign, PiggyBank, TrendingUp } from "lucide-react";
import { getSavingsHistory, getSpendingHistory, recentMonths } from "../utils/history";
import { monthKey } from "../utils/billPayments";
import { isRecordArray, safeReadJson } from "../utils/safeStorage";
import MonthlyReview from "../features/monthlyReview";
import { useBudget } from "../context";
import { monthlyIncomeSeries } from "../features/income/income";

const tooltipStyle = { background: "#1d2438", border: "1px solid rgba(255,255,255,.12)", borderRadius: "10px" };
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function ReportsPage() {
  const { bills, effectiveMonthlyIncome, incomeEntries } = useBudget();
  const spendingHistory = getSpendingHistory();
  const savingsHistory = getSavingsHistory();
  const availableMonths = (() => {
    const keys = new Set([monthKey(), ...Object.keys(spendingHistory), ...Object.keys(savingsHistory), ...Object.keys(monthlyIncomeSeries(incomeEntries))]);
    return [...keys].sort().reverse().map((key) => ({
      key,
      label: new Date(`${key}-15T12:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    }));
  })();
  const [selectedMonth, setSelectedMonth] = useState(availableMonths[0]?.key || monthKey());
  const budgetCategories = safeReadJson("budgetforge-budget-categories", [], isRecordArray);
  const incomeHistory = monthlyIncomeSeries(incomeEntries);
  const { spendingData, savingsData, categoryData, currentSpending, currentSavings } = (() => {
    const months = recentMonths();
    const thisMonth = months.at(-1).key;
    const categories = spendingHistory[thisMonth]?.categories || {};

    return {
      spendingData: months.map((month) => ({ month: month.label, spending: spendingHistory[month.key]?.total || 0 })),
      savingsData: months.map((month) => ({ month: month.label, saved: savingsHistory[month.key] || 0 })),
      categoryData: Object.entries(categories).map(([category, amount]) => ({ category, amount })),
      currentSpending: spendingHistory[thisMonth]?.total || 0,
      currentSavings: savingsHistory[thisMonth] || 0,
    };
  })();

  const plannedBills = bills.reduce((total, bill) => total + (Number(bill.amount) || 0), 0);
  const remainingIncome = effectiveMonthlyIncome - plannedBills;
  const selectedIncome = incomeHistory[selectedMonth] || 0;
  const selectedExpenses = spendingHistory[selectedMonth]?.total || 0;
  const netCashFlow = selectedIncome - selectedExpenses;
  const savingsRate = selectedIncome > 0 ? (netCashFlow / selectedIncome) * 100 : 0;
  const selectedYear = selectedMonth.slice(0, 4);
  const yearToDateIncome = Object.entries(incomeHistory).filter(([key]) => key.startsWith(selectedYear) && key <= selectedMonth).reduce((sum, [, amount]) => sum + amount, 0);
  const sourceData = Object.entries(incomeEntries.filter((entry) => entry.dateReceived?.startsWith(selectedMonth)).reduce((totals, entry) => ({ ...totals, [entry.sourceType]: (totals[entry.sourceType] || 0) + Number(entry.amount || 0) }), {})).map(([source, amount]) => ({ source, amount }));
  const incomeData = recentMonths().map((month) => ({ month: month.label, income: incomeHistory[month.key] || 0 }));

  return (
    <div className="insights-page">
      <header className="insights-header">
        <div><h1>Reports</h1><p className="text-muted">Track your financial trends as you pay bills and grow your savings.</p></div>
      </header>

      <MonthlyReview
        selectedMonth={selectedMonth}
        months={availableMonths}
        onMonthChange={setSelectedMonth}
        bills={bills}
        monthlyIncome={effectiveMonthlyIncome}
        spendingHistory={spendingHistory}
        savingsHistory={savingsHistory}
        budgetCategories={budgetCategories}
      />

      <section className="report-stats">
        <div><CircleDollarSign size={22} /><span>Income after planned bills</span><strong>{currency.format(remainingIncome)}</strong></div>
        <div><TrendingUp size={22} /><span>Payments recorded this month</span><strong>{currency.format(currentSpending)}</strong></div>
        <div><PiggyBank size={22} /><span>Savings balance</span><strong>{currency.format(currentSavings)}</strong></div>
        <div><CircleDollarSign size={22} /><span>Net cash flow ({selectedMonth})</span><strong>{currency.format(netCashFlow)}</strong></div>
        <div><TrendingUp size={22} /><span>Savings rate ({selectedMonth})</span><strong>{savingsRate.toFixed(1)}%</strong></div>
        <div><CircleDollarSign size={22} /><span>{selectedYear} income through selected month</span><strong>{currency.format(yearToDateIncome)}</strong></div>
      </section>

      <section className="report-grid">
        <div className="panel chart-panel"><div className="chart-heading"><div><CircleDollarSign size={21} /><h2>Income by month</h2></div><span>Last 6 months</span></div><ResponsiveContainer width="100%" height={300}><BarChart data={incomeData}><CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} /><XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} /><YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => currency.format(value)} /><Bar dataKey="income" name="Recorded income" fill="#22c55e" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div>
        <div className="panel chart-panel"><div className="chart-heading"><div><ChartNoAxesCombined size={21} /><h2>Income by source type</h2></div><span>{selectedMonth}</span></div>{sourceData.length ? <ResponsiveContainer width="100%" height={300}><BarChart data={sourceData} layout="vertical"><CartesianGrid stroke="rgba(255,255,255,.08)" horizontal={false} /><XAxis type="number" stroke="#94a3b8" tickFormatter={(value) => `$${value}`} /><YAxis dataKey="source" type="category" stroke="#94a3b8" width={100} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => currency.format(value)} /><Bar dataKey="amount" name="Recorded income" fill="#5b7cff" /></BarChart></ResponsiveContainer> : <div className="report-empty"><p>No recorded income for this month.</p></div>}</div>
      </section>
      <section className="panel chart-panel"><div className="chart-heading"><div><ChartNoAxesCombined size={21} /><h2>Income versus paid bills</h2></div><span>{selectedMonth}</span></div><ResponsiveContainer width="100%" height={260}><BarChart data={[{ label: selectedMonth, income: selectedIncome, expenses: selectedExpenses }]}><CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} /><XAxis dataKey="label" stroke="#94a3b8" /><YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value}`} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => currency.format(value)} /><Legend /><Bar dataKey="income" name="Recorded income" fill="#22c55e" /><Bar dataKey="expenses" name="Paid bills recorded" fill="#f59e0b" /></BarChart></ResponsiveContainer><p className="chart-note">Expenses include only bills marked paid; BudgetForge does not store general expense transactions.</p></section>

      <section className="report-grid">
        <div className="panel chart-panel">
          <div className="chart-heading"><div><ChartNoAxesCombined size={21} /><h2>Monthly spending history</h2></div><span>Last 6 months</span></div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spendingData}><CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} /><XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} /><YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => currency.format(value)} /><Bar dataKey="spending" name="Paid bills" fill="#5b7cff" radius={[8, 8, 0, 0]} /></BarChart>
          </ResponsiveContainer>
          <p className="chart-note">Payments are added to this chart whenever you mark a bill paid.</p>
        </div>

        <div className="panel chart-panel">
          <div className="chart-heading"><div><PiggyBank size={21} /><h2>Savings growth</h2></div><span>Last 6 months</span></div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={savingsData}><defs><linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={.5} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} /><XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} /><YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => currency.format(value)} /><Area type="monotone" dataKey="saved" name="Savings" stroke="#22c55e" strokeWidth={3} fill="url(#savingsFill)" /></AreaChart>
          </ResponsiveContainer>
          <p className="chart-note">A monthly snapshot is saved whenever you change a savings goal.</p>
        </div>
      </section>

      <section className="panel chart-panel report-category-chart">
        <div className="chart-heading"><div><ChartNoAxesCombined size={21} /><h2>Financial trends by category</h2></div><span>This month</span></div>
        {categoryData.length ? <ResponsiveContainer width="100%" height={300}><BarChart data={categoryData} layout="vertical" margin={{ left: 24 }}><CartesianGrid stroke="rgba(255,255,255,.08)" horizontal={false} /><XAxis type="number" stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} /><YAxis dataKey="category" type="category" stroke="#94a3b8" tickLine={false} axisLine={false} width={100} /><Tooltip contentStyle={tooltipStyle} formatter={(value) => currency.format(value)} /><Legend /><Bar dataKey="amount" name="Paid amount" fill="#7c3aed" radius={[0, 8, 8, 0]} /></BarChart></ResponsiveContainer> : <div className="report-empty"><ChartNoAxesCombined size={28} /><p>Mark bills paid to start your spending history and category trends.</p></div>}
      </section>
    </div>
  );
}

export default ReportsPage;
