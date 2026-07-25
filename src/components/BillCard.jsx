import { Badge, Button } from "../ui";

function BillCard({ bill, togglePaid, deleteBill }) {
  const today = new Date(); const dueDate = new Date(`${bill.occurrenceDate || bill.dueDate}T12:00:00`); const diff = (dueDate - today) / 86400000;
  const status = bill.paid ? "paid" : diff < 0 ? "overdue" : diff <= 3 ? "dueSoon" : "upcoming";
  const labels = { paid: "Paid", overdue: "Overdue", dueSoon: "Due soon", upcoming: "Upcoming" };
  return <article className={`bill-card ${status}`}><div className="bill-card__content"><div><h3 className="bill-card__title">{bill.name}</h3><div className="bill-card__meta"><Badge variant="info" size="sm">{bill.category}</Badge><span>Due {dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span><span className={`bill-status bill-status--${status}`}>{labels[status]}</span></div><p className="bill-card__amount">{Number(bill.amount).toLocaleString("en-US", { style: "currency", currency: "USD" })}</p></div><div className="bill-card__actions"><Button size="sm" onClick={() => togglePaid(bill.id)}>{bill.paid ? "Mark unpaid" : "Mark paid"}</Button><Button size="sm" variant="secondary" onClick={() => deleteBill(bill.id)}>Delete</Button></div></div></article>;
}
export default BillCard;
