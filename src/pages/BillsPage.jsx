import { useMemo, useState } from "react";
import BillForm from "../components/BillForm";
import BillList from "../components/BillList";
import BillsSummary from "../features/bills/BillsSummary";
import BillsToolbar from "../features/bills/BillsToolbar";
import { isPaidForMonth } from "../utils/billPayments";
import { useBudget } from "../context";

function occurrenceDate(bill, date = new Date()) { const source = new Date(`${bill.dueDate}T12:00:00`); const maxDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); return new Date(date.getFullYear(), date.getMonth(), Math.min(source.getDate(), maxDay), 12).toISOString().slice(0, 10); }
function BillsPage() {
  const { bills, addBill, togglePaid, deleteBill } = useBudget(); const [search, setSearch] = useState(""); const [filter, setFilter] = useState("all");
  const filteredBills = useMemo(() => bills.map((bill) => ({ ...bill, paid: isPaidForMonth(bill), occurrenceDate: occurrenceDate(bill) })).filter((bill) => bill.name.toLowerCase().includes(search.toLowerCase()) && (filter === "all" || filter === "paid" ? bill.paid : !bill.paid)), [bills, search, filter]);
  return <div className="workspace-page"><header className="workspace-header"><div><h1>Bills</h1><p>Manage bills for {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.</p></div></header><BillsSummary bills={filteredBills} /><div className="workspace-section"><BillsToolbar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} /></div><div className="bills-workspace"><BillForm addBill={addBill} /><BillList bills={filteredBills} togglePaid={togglePaid} deleteBill={deleteBill} /></div></div>;
}
export default BillsPage;
