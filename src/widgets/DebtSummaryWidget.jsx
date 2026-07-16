function DebtSummaryWidget({ debts }) {
  const totalDebt = debts.reduce(
    (sum, debt) => sum + Number(debt.balance),
    0
  );

  const totalMinimum = debts.reduce(
    (sum, debt) => sum + Number(debt.minimum),
    0
  );

  const averageAPR =
    debts.length > 0
      ? (
          debts.reduce(
            (sum, debt) =>
              sum + Number(debt.apr),
            0
          ) / debts.length
        ).toFixed(2)
      : "0.00";

  return (
    <div className="widget">
      <h3>💳 Debt Overview</h3>

      <div className="dashboard">

        <div className="card">
          <h3>Total Debt</h3>
          <h2>
            $
            {totalDebt.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <h3>Monthly Minimum</h3>
          <h2>
            $
            {totalMinimum.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <h3>Accounts</h3>
          <h2>{debts.length}</h2>
        </div>

        <div className="card">
          <h3>Average APR</h3>
          <h2>{averageAPR}%</h2>
        </div>

      </div>
    </div>
  );
}

export default DebtSummaryWidget;