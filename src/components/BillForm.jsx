import { useState } from "react";
import { Plus } from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../ui";

function BillForm({ addBill }) {
  const [name, setName] = useState(""); const [amount, setAmount] = useState(""); const [dueDate, setDueDate] = useState(""); const [category, setCategory] = useState("Utilities");
  function handleSubmit(event) { event.preventDefault(); if (!name || !amount || !dueDate) return; addBill({ id: Date.now(), name, amount, dueDate, category, paid: false }); setName(""); setAmount(""); setDueDate(""); setCategory("Utilities"); }
  return <Card padding="lg"><CardHeader><div><CardTitle>Add a bill</CardTitle><p className="bf-card__description">Add a recurring expense to your monthly plan.</p></div></CardHeader><CardContent><form className="workspace-form" onSubmit={handleSubmit}><label>Bill name<input type="text" placeholder="e.g. Electric" value={name} onChange={(event) => setName(event.target.value)} /></label><label>Amount<input type="number" placeholder="0.00" value={amount} onChange={(event) => setAmount(event.target.value)} /></label><label>Due date<input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></label><label>Category<select value={category} onChange={(event) => setCategory(event.target.value)}><option>Housing</option><option>Utilities</option><option>Phone</option><option>Insurance</option><option>Transportation</option><option>Food</option><option>Entertainment</option><option>Subscription</option><option>Credit Card</option><option>Other</option></select></label><Button type="submit" leftIcon={<Plus size={16} />}>Add bill</Button></form></CardContent></Card>;
}
export default BillForm;
