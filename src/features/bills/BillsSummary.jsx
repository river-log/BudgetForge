function BillsSummary({ bills }) {
  const paid = bills.filter((bill) => bill.paid);
  const unpaid = bills.filter((bill) => !bill.paid);
  const totalMonthly = bills.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  const remaining = unpaid.reduce((sum, bill) => sum + Number(bill.amount || 0), 0);
  const format = (value) => Number(value).toLocaleString("en-US", { style: "currency", currency: "USD" });
  return <section className="workspace-summary" aria-label="Bills summary"><div><span>Total monthly bills</span><strong>{format(totalMonthly)}</strong></div><div><span>Paid</span><strong>{paid.length}</strong></div><div><span>Remaining</span><strong>{format(remaining)}</strong></div><div><span>Upcoming</span><strong>{unpaid.length}</strong></div></section>;
}
export default BillsSummary;
