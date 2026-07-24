import { useMemo, useState } from "react";

import BillForm from "../components/BillForm";
import BillList from "../components/BillList";

import BillsSummary from "../features/bills/BillsSummary";
import BillsToolbar from "../features/bills/BillsToolbar";
import { isPaidForMonth } from "../utils/billPayments";

function occurrenceDate(bill, date = new Date()) {
  const source = new Date(`${bill.dueDate}T12:00:00`);
  const maxDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return new Date(date.getFullYear(), date.getMonth(), Math.min(source.getDate(), maxDay), 12).toISOString().slice(0, 10);
}

function BillsPage({
  bills,
  addBill,
  togglePaid,
  deleteBill,
}) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredBills = useMemo(() => {
    return bills.map((bill) => ({
      ...bill,
      paid: isPaidForMonth(bill),
      occurrenceDate: occurrenceDate(bill),
    })).filter((bill) => {
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
            Manage bills for {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}.
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
