import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChartNoAxesCombined } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "../ui";

const COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#A855F7", "#EF4444", "#14B8A6", "#64748B"];
const safeAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? amount : 0;
};

function CustomTooltip({ active, payload, totalPlanned }) {
  if (!active || !payload?.length) return null;
  const value = safeAmount(payload[0].value);
  const percent = totalPlanned > 0 ? ((value / totalPlanned) * 100).toFixed(1) : 0;
  return <div className="chart-tooltip"><strong>{payload[0].name}</strong><div>{value.toLocaleString("en-US", { style: "currency", currency: "USD" })}</div><small>{percent}% of planned bills</small></div>;
}

function CategoryPieChart({ bills }) {
  const categoryTotals = {};
  (Array.isArray(bills) ? bills : []).forEach((bill) => {
    const category = bill?.category || "Other";
    categoryTotals[category] = (categoryTotals[category] || 0) + safeAmount(bill?.amount);
  });
  const chartData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .filter((entry) => entry.value > 0)
    .sort((a, b) => b.value - a.value);
  const totalPlanned = chartData.reduce((sum, item) => sum + item.value, 0);
  const largestCategory = chartData[0] || null;

  function renderCenterLabel({ viewBox }) {
    if (!viewBox) return null;
    const { cx, cy } = viewBox;
    return <><text x={cx} y={cy - 8} textAnchor="middle" fill="#F8FAFC" fontSize="28" fontWeight="700">{totalPlanned.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}</text><text x={cx} y={cy + 18} textAnchor="middle" fill="#A8B4C5" fontSize="13">Monthly bills</text></>;
  }

  return <Card className="widget dashboard-widget--wide" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><ChartNoAxesCombined size={19} aria-hidden="true" /></span><div><CardTitle className="dashboard-widget__title">Planned bills by category</CardTitle><p className="dashboard-widget__description">How your monthly bill plan is distributed by category.</p></div></div></CardHeader><CardContent>{chartData.length === 0 ? <EmptyState className="dashboard-empty" icon={<ChartNoAxesCombined aria-hidden="true" />} title="No bill plan yet" description="Add bills to see your planned category breakdown." /> : <><div className="spending-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} dataKey="value" nameKey="name" innerRadius={82} outerRadius={122} paddingAngle={3} cornerRadius={10} label={renderCenterLabel} isAnimationActive animationDuration={900}>{chartData.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip content={<CustomTooltip totalPlanned={totalPlanned} />} /></PieChart></ResponsiveContainer></div><div className="spending-legend" aria-label="Planned bills by category">{chartData.map((item, index) => { const percent = ((item.value / totalPlanned) * 100).toFixed(1); return <div className="spending-legend__item" key={item.name}><div className="spending-legend__name"><span className="spending-legend__dot" style={{ background: COLORS[index % COLORS.length] }} aria-hidden="true" /><span>{item.name}</span></div><span className="spending-legend__value">{item.value.toLocaleString("en-US", { style: "currency", currency: "USD" })} · {percent}%</span></div>; })}</div>{largestCategory && <div className="largest-category"><div className="largest-category__label">Largest planned category</div><div className="largest-category__value">{largestCategory.name}</div><p className="largest-category__meta">{largestCategory.value.toLocaleString("en-US", { style: "currency", currency: "USD" })} · {((largestCategory.value / totalPlanned) * 100).toFixed(1)}%</p></div>}</>}</CardContent></Card>;
}

export default CategoryPieChart;
