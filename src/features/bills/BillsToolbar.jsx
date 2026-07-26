function BillsToolbar({
  search,
  setSearch,
  filter,
  setFilter,
}) {
  return (
    <div
      className="panel"
      style={{
        marginBottom: "25px",
      }}
    >
      <label className="sr-only" htmlFor="bills-search">Search bills</label>
      <input
        id="bills-search"
        type="search"
        type="text"
        placeholder="Search bills..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <label className="sr-only" htmlFor="bills-status-filter">Filter bills by status</label>
      <select
        id="bills-status-filter"
        value={filter}
        onChange={(e) =>
          setFilter(e.target.value)
        }
      >
        <option value="all">
          All Bills
        </option>

        <option value="paid">
          Paid
        </option>

        <option value="unpaid">
          Unpaid
        </option>
      </select>
    </div>
  );
}

export default BillsToolbar;
