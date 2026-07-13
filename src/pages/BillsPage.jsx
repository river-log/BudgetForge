import { useMemo, useState } from "react";

import BillForm from "../components/BillForm";
import BillList from "../components/BillList";

import BillsSummary from "../features/bills/BillsSummary";
import BillsToolbar from "../features/bills/BillsToolbar";

function BillsPage({
  bills,
  addBill,
  togglePaid,
  deleteBill,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      const matchesSearch =
        bill.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all"
          ? true
          : filter === "paid"
          ? bill.paid
          : !bill.paid;

      return matchesSearch && matchesFilter;
    });
  }, [bills, search, filter]);

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1>💳 Bills</h1>

          <p>
            Manage all of your monthly bills.
          </p>
        </div>
      </div>

      <BillsSummary bills={filteredBills} />

      <BillsToolbar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
      />

      <div className="content-grid">

        <BillForm
          addBill={addBill}
        />

        <BillList
          bills={filteredBills}
          togglePaid={togglePaid}
          deleteBill={deleteBill}
        />

      </div>
    </>
  );
}

export default BillsPage;