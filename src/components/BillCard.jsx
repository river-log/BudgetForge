import { useState } from "react";
import { Badge, Button, Modal } from "../ui";
import { formatStoredDateSafely, parseStoredDate } from "../utils/storedDates";

function BillCard({ bill, togglePaid, deleteBill }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const today = new Date(); const storedDate = bill.occurrenceDate || bill.dueDate; const dueDate = parseStoredDate(storedDate); const diff = dueDate ? (dueDate - today) / 86400000 : null;
  const status = bill.paid ? "paid" : diff === null ? "invalid" : diff < 0 ? "overdue" : diff <= 3 ? "dueSoon" : "upcoming";
  const labels = { paid: "Paid", invalid: "Invalid date", overdue: "Overdue", dueSoon: "Due soon", upcoming: "Upcoming" };
  return <><article className={`bill-card ${status}`}><div className="bill-card__content"><div><h3 className="bill-card__title">{bill.name}</h3><div className="bill-card__meta"><Badge variant="info" size="sm">{bill.category}</Badge><span>Due {formatStoredDateSafely(storedDate)}</span><span className={`bill-status bill-status--${status}`}>{labels[status]}</span></div><p className="bill-card__amount">{Number(bill.amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}</p></div><div className="bill-card__actions"><Button size="sm" onClick={() => togglePaid(bill.id)}>{bill.paid ? "Mark unpaid" : "Mark paid"}</Button><Button size="sm" variant="secondary" onClick={() => setConfirmDelete(true)}>Delete</Button></div></div></article><Modal open={confirmDelete} onClose={() => setConfirmDelete(false)} title={`Delete ${bill.name}?`} description="This removes the bill and its recorded monthly payment status from your workspace." size="sm" footer={<><Button variant="secondary" onClick={() => setConfirmDelete(false)}>Cancel</Button><Button variant="danger" data-autofocus onClick={() => { setConfirmDelete(false); deleteBill(bill.id); }}>Delete bill</Button></>} /></>;
}
export default BillCard;
