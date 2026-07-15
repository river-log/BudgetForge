function SavingsSummaryWidget({ goals }) {
  const totalSaved = goals.reduce(
    (sum, goal) => sum + Number(goal.saved),
    0
  );

  const totalGoal = goals.reduce(
    (sum, goal) => sum + Number(goal.target),
    0
  );

  const remaining = Math.max(
    totalGoal - totalSaved,
    0
  );

  const percent =
    totalGoal > 0
      ? Math.round((totalSaved / totalGoal) * 100)
      : 0;

  return (
    <div className="widget">
      <h3>🏦 Savings Overview</h3>

      <div className="dashboard">

        <div className="card">
          <h3>Total Saved</h3>

          <h2>
            $
            {totalSaved.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <h3>Goal Total</h3>

          <h2>
            $
            {totalGoal.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <h3>Remaining</h3>

          <h2>
            $
            {remaining.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <h3>Completion</h3>

          <h2>{percent}%</h2>
        </div>

      </div>
    </div>
  );
}

export default SavingsSummaryWidget;