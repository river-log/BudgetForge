function BillCard({ bill, togglePaid, deleteBill }) {

  const today = new Date();

  const dueDate = new Date(`${bill.occurrenceDate || bill.dueDate}T12:00:00`);

  const diff =
    (dueDate - today) / (1000 * 60 * 60 * 24);

  let status = "";

  if (bill.paid) {

    status = "paid";

  } else if (diff < 0) {

    status = "overdue";

  } else if (diff <= 3) {

    status = "dueSoon";

  }

  return (
    <div className={`bill-card ${status}`}>

      <div>

        <h3>{bill.name}</h3>

        <span className="category">
          {bill.category}
        </span>

        <p>
          {Number(bill.amount).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>

        <small>
          Due{" "}
          {dueDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </small>

      </div>

      <div className="buttons">

        <button onClick={() => togglePaid(bill.id)}>
          {bill.paid ? "✅ Paid" : "Mark Paid"}
        </button>

        <button onClick={() => deleteBill(bill.id)}>
          Delete
        </button>

      </div>

    </div>
  );
}

export default BillCard;
