import { useMemo, useState } from "react";
import BillForm from "../components/BillForm";
import BillList from "../components/BillList";
import BillsSummary from "../features/bills/BillsSummary";
import BillsToolbar from "../features/bills/BillsToolbar";
import { isPaidForMonth } from "../utils/billPayments";
import { useBudget } from "../context";
import { recurringStoredDate } from "../utils/storedDates";
import { filterCurrentBills } from "../features/bills/filterBills";

function BillsPage() {
  const { bills, addBill, togglePaid, deleteBill } = useBudget(); const [search, setSearch] = useState(""); const [filter, setFilter] = useState("all");
  const currentBills = useMemo(() => bills.map((bill) => ({ ...bill, paid: isPaidForMonth(bill), occurrenceDate: recurringStoredDate(bill.dueDate) })), [bills]);
  const filteredBills = useMemo(() => filterCurrentBills(currentBills, search, filter), [currentBills, search, filter]);
  return <div className="workspace-page"><header className="workspace-header"><div><h1>Bills</h1><p>Manage bills for {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.</p></div></header><BillsSummary bills={currentBills} /><div className="workspace-section"><BillsToolbar search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} /></div><div className="bills-workspace"><BillForm addBill={addBill} /><BillList bills={filteredBills} togglePaid={togglePaid} deleteBill={deleteBill} /></div></div>;
}
export default BillsPage;
