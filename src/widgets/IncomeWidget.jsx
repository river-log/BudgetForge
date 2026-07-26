import { useState } from "react";
import { Banknote, Pencil, Save, X } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Progress } from "../ui";
import { useToast } from "../features/toasts";

function IncomeWidget({ income, bills, setIncome }) {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(income);
  const totalBills = bills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  const percentUsed = income > 0 ? (totalBills / income) * 100 : 0;
  const progressWidth = Math.min(percentUsed, 100);
  const progressColor = percentUsed >= 80 ? "danger" : percentUsed >= 50 ? "warning" : "success";
  const format = (amount) => Number(amount).toLocaleString("en-US", { style: "currency", currency: "USD" });

  function saveIncome() {
    const newIncome = Number(value);
    if (!Number.isNaN(newIncome) && newIncome >= 0) {
      setIncome(newIncome);
      showToast("Monthly income updated!", "success");
      setEditing(false);
    }
  }

  return (
    <Card className="widget dashboard-widget--income" variant="elevated" padding="lg">
      <CardHeader className="dashboard-widget__header">
        <div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><Banknote size={19} aria-hidden="true" /></span><div><CardTitle className="dashboard-widget__title">Monthly income</CardTitle><p className="dashboard-widget__description">Your income and committed bills this month.</p></div></div>
      </CardHeader>
      <CardContent>
        {!editing ? <><p className="income-value">{format(income)}</p><Progress value={progressWidth} max={100} color={progressColor} label="Income committed to bills" showValue /><p className={`income-status ${percentUsed > 100 ? "income-status--danger" : ""}`}>{percentUsed.toFixed(0)}% of income committed{percentUsed > 100 ? " — over budget" : ""}</p><p className="income-summary">{format(totalBills)} of {format(income)} committed to bills.</p><div className="income-actions"><Button leftIcon={<Pencil size={16} />} onClick={() => { setValue(income); setEditing(true); }}>Edit income</Button></div></> : <div className="income-form"><label htmlFor="monthly-income">Monthly income</label><input id="monthly-income" type="number" min="0" step="0.01" inputMode="decimal" value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") saveIncome(); }} /><div className="income-actions"><Button leftIcon={<Save size={16} />} onClick={saveIncome}>Save</Button><Button variant="secondary" leftIcon={<X size={16} />} onClick={() => { setEditing(false); setValue(income); }}>Cancel</Button></div></div>}
      </CardContent>
    </Card>
  );
}

export default IncomeWidget;
