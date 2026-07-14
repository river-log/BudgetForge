import { useState } from "react";

function IncomeWidget({ income, setIncome }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(income);

  function saveIncome() {
    const newIncome = Number(value);

    if (!Number.isNaN(newIncome) && newIncome >= 0) {
      setIncome(newIncome);
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

          <p>Available this month</p>

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