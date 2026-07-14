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
      <input
        type="text"
        placeholder="Search bills..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <select
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