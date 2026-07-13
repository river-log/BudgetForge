function BillsSummary({ bills }) {
  const paid = bills.filter((b) => b.paid);

  const unpaid = bills.filter((b) => !b.paid);

  const totalDue = unpaid.reduce(
    (sum, bill) => sum + Number(bill.amount || 0),
    0
  );

  return (
    <div className="widget-grid">

      <div className="widget">
        <h3>Total Bills</h3>
        <h1>{bills.length}</h1>
      </div>

      <div className="widget">
        <h3>Paid</h3>
        <h1>{paid.length}</h1>
      </div>

      <div className="widget">
        <h3>Unpaid</h3>
        <h1>{unpaid.length}</h1>
      </div>

      <div className="widget">
        <h3>Total Due</h3>
        <h1>
          {totalDue.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </h1>
      </div>

    </div>
  );
}

export default BillsSummary;