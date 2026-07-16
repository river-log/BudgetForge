function DebtCard({
  debt,
  onPayment,
  onEdit,
  onDelete,
}) {
  const minimumPercent =
    debt.balance > 0
      ? Math.min(
          (debt.minimum / debt.balance) * 100,
          100
        )
      : 0;

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
        <h3>{debt.name}</h3>

        <strong>{debt.apr}% APR</strong>
      </div>

      <div className="progress">
        <div
          className="progress-fill"
          style={{
            width: `${minimumPercent}%`,
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
          Balance: $
          {debt.balance.toLocaleString()}
        </strong>
      </p>

      <p
        className="text-muted"
        style={{
          marginBottom: "4px",
        }}
      >
        Minimum Payment: $
        {debt.minimum.toLocaleString()}
      </p>

      <p
        className="text-muted"
        style={{
          marginBottom: "22px",
        }}
      >
        Interest Rate: {debt.apr}%
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
            onPayment(debt.id)
          }
        >
          💰 Payment
        </button>

        <button
          onClick={() =>
            onEdit(debt)
          }
          style={{
            background: "#FAA61A",
          }}
        >
          ✏️ Edit
        </button>

        <button
          onClick={() =>
            onDelete(debt.id)
          }
          style={{
            gridColumn: "1 / -1",
            background: "#ED4245",
          }}
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}

export default DebtCard;