import { useState } from "react";
import BillCard from "./BillCard";

function BillList({ bills, togglePaid, deleteBill }) {
  const [search, setSearch] = useState("");

  const filteredBills = bills
    .filter((bill) =>
      bill.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(a.dueDate) - new Date(b.dueDate)
    );

  return (
    <div className="panel">
      <h2>Your Bills</h2>

      <input
        type="text"
        placeholder="🔍 Search bills..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredBills.length === 0 ? (
        <p>No matching bills.</p>
      ) : (
        filteredBills.map((bill) => (
          <BillCard
            key={bill.id}
            bill={bill}
            togglePaid={togglePaid}
            deleteBill={deleteBill}
          />
        ))
      )}
    </div>
  );
}

export default BillList;