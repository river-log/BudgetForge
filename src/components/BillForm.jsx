import { useState } from "react";

function BillForm({ addBill }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("Utilities");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !amount || !dueDate) return;

    addBill({
      id: Date.now(),
      name,
      amount,
      dueDate,
      category,
      paid: false,
    });

    setName("");
    setAmount("");
    setDueDate("");
    setCategory("Utilities");
  }

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h2>Add Bill</h2>

      <input
        type="text"
        placeholder="Bill Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option>Housing</option>
        <option>Utilities</option>
        <option>Phone</option>
        <option>Insurance</option>
        <option>Transportation</option>
        <option>Food</option>
        <option>Entertainment</option>
        <option>Subscription</option>
        <option>Credit Card</option>
        <option>Other</option>
      </select>

      <button>Add Bill</button>
    </form>
  );
}

export default BillForm;