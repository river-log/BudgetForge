import { useState } from "react";

function AddSavingsGoal({ addGoal }) {
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !target) return;

    addGoal({
      id: Date.now(),
      name: name.trim(),
      target: Number(target),
      saved: Number(saved) || 0,
    });

    setName("");
    setTarget("");
    setSaved("");
  }

  return (
    <div className="widget">
      <h3>➕ New Savings Goal</h3>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Goal Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Target Amount"
          value={target}
          onChange={(e) =>
            setTarget(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Current Saved"
          value={saved}
          onChange={(e) =>
            setSaved(e.target.value)
          }
        />

        <button type="submit">
          Add Goal
        </button>

      </form>
    </div>
  );
}

export default AddSavingsGoal;