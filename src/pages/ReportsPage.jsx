import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartNoAxesCombined, CircleDollarSign, PiggyBank, TrendingUp } from "lucide-react";
import { getSavingsHistory, getSpendingHistory, recentMonths } from "../utils/history";
import { useBudget } from "../context";

const tooltipStyle = { background: "#1d2438", border: "1px solid rgba(255,255,255,.12)", borderRadius: "10px" };
const currency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function ReportsPage() {
  const { bills, monthlyIncome } = useBudget();
  const { spendingData, savingsData, categoryData, currentSpending, currentSavings } = (() => {
    const spending = getSpendingHistory();
    const savings = getSavingsHistory();
    const months = recentMonths();
    const thisMonth = months.at(-1).key;
    const categories = spending[thisMonth]?.categories || {};

    return {
      spendingData: months.map((month) => ({ month: month.label, spending: spending[month.key]?.total || 0 })),
      savingsData: months.map((month) => ({ month: month.label, saved: savings[month.key] || 0 })),
      categoryData: Object.entries(categories).map(([category, amount]) => ({ category, amount })),
      currentSpending: spending[thisMonth]?.total || 0,
      currentSavings: savings[thisMonth] || 0,
    };
  })();

  const plannedBills = bills.reduce((total, bill) => total + (Number(bill.amount) || 0), 0);
  const remainingIncome = monthlyIncome - plannedBills;

  return (
    <>
      <div className="dashboard-header">
        <div><h1>Reports</h1><p className="text-muted">Track your financial trends as you pay bills and grow your savings.</p></div>
      </div>

      <section className="report-stats">
        <div><CircleDollarSign size={22} /><span>Income after planned bills</span><strong>{currency.format(remainingIncome)}</strong></div>
        <div><TrendingUp size={22} /><span>Payments recorded this month</span><strong>{currency.format(currentSpending)}</strong></div>
        <div><PiggyBank size={22} /><span>Savings balance</span><strong>{currency.format(currentSavings)}</strong></div>
      </section>

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
    </>
  );
}

export default ReportsPage;
