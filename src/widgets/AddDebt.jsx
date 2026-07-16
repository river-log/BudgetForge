import { useState } from "react";

function AddDebt({ addDebt }) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [apr, setApr] = useState("");
  const [minimum, setMinimum] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !name.trim() ||
      !balance ||
      !apr ||
      !minimum
    ) {
      return;
    }

    addDebt({
      id: Date.now(),
      name: name.trim(),
      balance: Number(balance),
      apr: Number(apr),
      minimum: Number(minimum),
    });

    setName("");
    setBalance("");
    setApr("");
    setMinimum("");
  }

  return (
    <div className="widget">
      <h3>➕ Add Debt</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Debt Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Current Balance"
          value={balance}
          onChange={(e) =>
            setBalance(e.target.value)
          }
        />

        <input
          type="number"
          step="0.01"
          placeholder="APR (%)"
          value={apr}
          onChange={(e) =>
            setApr(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Minimum Payment"
          value={minimum}
          onChange={(e) =>
            setMinimum(e.target.value)
          }
        />

        <button type="submit">
          Add Debt
        </button>
      </form>
    </div>
  );
}

export default AddDebt;