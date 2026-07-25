import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Wallet } from "lucide-react";
import { useBudget } from "../context";

const STORAGE_KEY = "budgetforge-budget-categories";
const DEFAULT_CATEGORIES = ["Housing", "Food", "Transport", "Utilities", "Fun"];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function BudgetPage() {
  const { bills, monthlyIncome } = useBudget();
  const [categories, setCategories] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return saved.length ? saved : DEFAULT_CATEGORIES.map((name) => ({ id: crypto.randomUUID(), name, amount: 0 }));
    } catch {
      return [];
    }
  });
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const billsTotal = useMemo(
    () => bills.reduce((total, bill) => total + Number(bill.amount || 0), 0),
    [bills]
  );
  const plannedTotal = categories.reduce((total, category) => total + Number(category.amount || 0), 0);
  const remaining = monthlyIncome - plannedTotal - billsTotal;

  function updateAmount(id, amount) {
    setCategories((current) => current.map((category) => (
      category.id === id ? { ...category, amount: Math.max(0, Number(amount) || 0) } : category
    )));
  }

  function addCategory(event) {
    event.preventDefault();
    const name = newCategory.trim();
    if (!name) return;
    setCategories((current) => [...current, { id: crypto.randomUUID(), name, amount: 0 }]);
    setNewCategory("");
  }

  return (
    <div className="workspace-page">
      <div className="workspace-header">
        <div>
          <h1>Budget</h1>
          <p className="text-muted">Plan every dollar of this month’s income.</p>
        </div>
      </div>

      <section className="budget-summary" aria-label="Budget summary">
        <div><span>Monthly income</span><strong>{formatCurrency(monthlyIncome)}</strong></div>
        <div><span>Recurring bills</span><strong>{formatCurrency(billsTotal)}</strong></div>
        <div><span>Category plan</span><strong>{formatCurrency(plannedTotal)}</strong></div>
        <div className={remaining < 0 ? "budget-negative" : ""}><span>{remaining < 0 ? "Over budget" : "Left to assign"}</span><strong>{formatCurrency(Math.abs(remaining))}</strong></div>
      </section>

      <section className="panel budget-panel workspace-section">
        <div className="budget-panel-heading">
          <div><Wallet size={22} aria-hidden="true" /><h2>Spending plan</h2></div>
          <span>{monthlyIncome ? `${Math.min(100, Math.round(((plannedTotal + billsTotal) / monthlyIncome) * 100))}% assigned` : "Add income to begin"}</span>
        </div>
        <div className="budget-progress"><span style={{ width: `${monthlyIncome ? Math.min(100, ((plannedTotal + billsTotal) / monthlyIncome) * 100) : 0}%` }} /></div>

        <div className="budget-list">
          {categories.map((category) => (
            <div className="budget-row" key={category.id}>
              <span>{category.name}</span>
              <label>
                <span className="sr-only">{category.name} monthly budget</span>
                <input type="number" min="0" step="1" value={category.amount || ""} placeholder="0" onChange={(event) => updateAmount(category.id, event.target.value)} />
              </label>
              <button className="icon-button" aria-label={`Remove ${category.name}`} onClick={() => setCategories((current) => current.filter((item) => item.id !== category.id))}><Trash2 size={17} /></button>
            </div>
          ))}
        </div>

        <form className="add-category" onSubmit={addCategory}>
          <input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="New category, e.g. Health" />
          <button type="submit"><Plus size={18} /> Add category</button>
        </form>
      </section>
    </div>
  );
}

export default BudgetPage;
