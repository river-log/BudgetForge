export function filterCurrentBills(bills, search, filter) {
  return (Array.isArray(bills) ? bills : []).filter((bill) => {
    const matchesSearch = String(bill?.name || "").toLowerCase().includes(String(search || "").toLowerCase());
    const matchesFilter = filter === "all" || (filter === "paid" ? bill?.paid : !bill?.paid);
    return matchesSearch && matchesFilter;
  });
}
