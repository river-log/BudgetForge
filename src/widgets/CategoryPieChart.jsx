import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChartNoAxesCombined } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "../ui";

const COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#A855F7", "#EF4444", "#14B8A6", "#64748B"];

function CustomTooltip({ active, payload, totalSpending }) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const percent = totalSpending > 0 ? ((value / totalSpending) * 100).toFixed(1) : 0;
  return <div className="chart-tooltip"><strong>{payload[0].name}</strong><div>${Number(value).toLocaleString("en-US")}</div><small>{percent}% of spending</small></div>;
}

function CategoryPieChart({ bills }) {
  const categoryTotals = {};
  bills.forEach((bill) => { const category = bill.category || "Other"; categoryTotals[category] = (categoryTotals[category] || 0) + Number(bill.amount || 0); });
  const chartData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const totalSpending = chartData.reduce((sum, item) => sum + item.value, 0);
  const largestCategory = chartData.length > 0 ? chartData[0] : null;
  function renderCenterLabel({ viewBox }) { if (!viewBox) return null; const { cx, cy } = viewBox; return <><text x={cx} y={cy - 8} textAnchor="middle" fill="#F8FAFC" fontSize="28" fontWeight="700">${totalSpending.toLocaleString("en-US")}</text><text x={cx} y={cy + 18} textAnchor="middle" fill="#A8B4C5" fontSize="13">Monthly Bills</text></>; }
  return <Card className="widget dashboard-widget--wide" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><ChartNoAxesCombined size={19} aria-hidden="true" /></span><div><CardTitle className="dashboard-widget__title">Spending breakdown</CardTitle><p className="dashboard-widget__description">How your monthly bills are distributed by category.</p></div></div></CardHeader><CardContent>{chartData.length === 0 ? <EmptyState className="dashboard-empty" icon={<ChartNoAxesCombined aria-hidden="true" />} title="No spending data" description="Add bills to see your spending breakdown." /> : <><div className="spending-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} dataKey="value" nameKey="name" innerRadius={82} outerRadius={122} paddingAngle={3} cornerRadius={10} label={renderCenterLabel} isAnimationActive animationDuration={900}>{chartData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip content={<CustomTooltip totalSpending={totalSpending} />} /></PieChart></ResponsiveContainer></div><div className="spending-legend">{chartData.map((item, index) => { const percent = ((item.value / totalSpending) * 100).toFixed(1); return <div className="spending-legend__item" key={item.name}><div className="spending-legend__name"><span className="spending-legend__dot" style={{ background: COLORS[index % COLORS.length] }} /><span>{item.name}</span></div><span className="spending-legend__value">${item.value.toLocaleString("en-US")} · {percent}%</span></div>; })}</div>{largestCategory && <div className="largest-category"><div className="largest-category__label">Largest category</div><div className="largest-category__value">{largestCategory.name}</div><p className="largest-category__meta">${largestCategory.value.toLocaleString("en-US")} · {((largestCategory.value / totalSpending) * 100).toFixed(1)}%</p></div>}</>}</CardContent></Card>;
}

export default CategoryPieChart;
