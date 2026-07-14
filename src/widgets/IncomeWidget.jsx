import { useState } from "react";

function IncomeWidget({
  income,
  bills,
  setIncome,
  showToast,
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(income);

  const totalBills = bills.reduce(
    (sum, bill) => sum + Number(bill.amount || 0),
    0
  );

  const percentUsed =
    income > 0
      ? (totalBills / income) * 100
      : 0;

  const progressWidth = Math.min(percentUsed, 100);

  let barColor = "#22c55e";

  if (percentUsed >= 80) {
    barColor = "#ef4444";
  } else if (percentUsed >= 50) {
    barColor = "#f59e0b";
  }

  function saveIncome() {
    const newIncome = Number(value);

    if (!Number.isNaN(newIncome) && newIncome >= 0) {
      setIncome(newIncome);

      showToast(
        "Monthly income updated!",
        "success"
      );

      setEditing(false);
    }
  }

  return (
    <div className="widget">
      <h3>💰 Monthly Income</h3>

      {!editing ? (
        <>
          <h1>
            {income.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h1>

          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#2b3140",
              borderRadius: "999px",
              overflow: "hidden",
              marginTop: "18px",
            }}
          >
            <div
              style={{
                width: `${progressWidth}%`,
                height: "100%",
                background: barColor,
                transition: "all .3s ease",
              }}
            />
          </div>

          <p
            style={{
              marginTop: "12px",
              fontWeight: "600",
            }}
          >
            {percentUsed.toFixed(0)}% of income committed
            {percentUsed > 100 && (
              <span style={{ color: "#ef4444" }}>
                {" "}
                (Over Budget)
              </span>
            )}
          </p>

          <p
            style={{
              color: "var(--muted)",
            }}
          >
            {totalBills.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}{" "}
            of{" "}
            {income.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </p>

          <button
            style={{ marginTop: "15px" }}
            onClick={() => {
              setValue(income);
              setEditing(true);
            }}
          >
            Edit Income
          </button>
        </>
      ) : (
        <>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveIncome();
              }
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <button onClick={saveIncome}>
              Save
            </button>

            <button
              onClick={() => {
                setEditing(false);
                setValue(income);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default IncomeWidget;