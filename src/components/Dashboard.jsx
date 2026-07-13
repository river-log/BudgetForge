function Dashboard({ bills, monthlyIncome }) {
  const totalBills = bills.length;

  const totalAmount = bills.reduce(
    (sum, bill) => sum + Number(bill.amount),
    0
  );

  const paidBills = bills.filter((bill) => bill.paid).length;

  const unpaidBills = totalBills - paidBills;

  const remaining = monthlyIncome - totalAmount;

  const percentUsed =
    monthlyIncome > 0
      ? Math.min((totalAmount / monthlyIncome) * 100, 100)
      : 0;

  return (
    <>
      <div className="dashboard">

        <div className="card">
          <h3>Monthly Income</h3>
          <h2>
            {monthlyIncome.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h2>
        </div>

        <div className="card">
          <h3>Total Bills</h3>
          <h2>{totalBills}</h2>
        </div>

        <div className="card">
          <h3>Total Due</h3>
          <h2>
            {totalAmount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h2>
        </div>

        <div className="card">
          <h3>Remaining</h3>
          <h2>
            {remaining.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h2>
        </div>

      </div>

      <div className="panel">

        <h2>Monthly Budget</h2>

        <div className="progress">

          <div
            className="progress-fill"
            style={{
              width: `${percentUsed}%`,
            }}
          ></div>

        </div>

        <p style={{ marginTop: "12px" }}>
          {percentUsed.toFixed(1)}% of your income is
          currently allocated to bills.
        </p>

      </div>
    </>
  );
}

export default Dashboard;