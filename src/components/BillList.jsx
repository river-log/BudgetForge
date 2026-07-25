import { useState } from "react";
import { ReceiptText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "../ui";
import BillCard from "./BillCard";

function BillList({ bills, togglePaid, deleteBill }) {
  const [search, setSearch] = useState(""); const filteredBills = bills.filter((bill) => bill.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => new Date(a.occurrenceDate || a.dueDate) - new Date(b.occurrenceDate || b.dueDate));
  return <Card className="bill-list-card" padding="lg"><CardHeader><div><CardTitle>Your bills</CardTitle><p className="bf-card__description">Review and update this month’s due dates.</p></div></CardHeader><CardContent><div className="bill-list-card__search"><label className="sr-only" htmlFor="bill-list-search">Search bills</label><input id="bill-list-search" type="search" placeholder="Search bills..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>{filteredBills.length === 0 ? <EmptyState className="workspace-empty" icon={<ReceiptText aria-hidden="true" />} title="No matching bills" description="Try a different search or add your first bill." /> : filteredBills.map((bill) => <BillCard key={bill.id} bill={bill} togglePaid={togglePaid} deleteBill={deleteBill} />)}</CardContent></Card>;
}
export default BillList;
