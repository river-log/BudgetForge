function SavingsGoalCard({
  goal,
  onDeposit,
  onWithdraw,
  onDelete,
  onEdit,
}) {
  const progress =
    goal.target > 0
      ? Math.min(
          (goal.saved / goal.target) * 100,
          100
        )
      : 0;

  const remaining = Math.max(
    goal.target - goal.saved,
    0
  );

  return (
    <div className="widget">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <h3>{goal.name}</h3>

        <strong>
          {Math.round(progress)}%
        </strong>
      </div>

      <div className="progress">
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p
        style={{
          marginTop: "18px",
          marginBottom: "6px",
        }}
      >
        <strong>
          ${goal.saved.toLocaleString()}
        </strong>{" "}
        of $
        {goal.target.toLocaleString()}
      </p>

      <p
        className="text-muted"
        style={{
          marginBottom: "22px",
        }}
      >
        Remaining: $
        {remaining.toLocaleString()}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2, 1fr)",
          gap: "12px",
        }}
      >
        <button
          onClick={() =>
            onDeposit(goal.id)
          }
        >
          💰 Deposit
        </button>

        <button
          onClick={() =>
            onWithdraw(goal.id)
          }
        >
          ➖ Withdraw
        </button>

        <button
          onClick={() =>
            onEdit(goal)
          }
          style={{
            background: "#FAA61A",
          }}
        >
          ✏️ Edit
        </button>

        <button
          onClick={() =>
            onDelete(goal.id)
          }
          style={{
            background: "#ED4245",
          }}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}

export default SavingsGoalCard;