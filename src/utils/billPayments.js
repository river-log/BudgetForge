export function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function isPaidForMonth(bill, date = new Date()) {
  const key = monthKey(date);
  if (Array.isArray(bill.paidMonths)) return bill.paidMonths.includes(key);

  // Preserve existing paid bills as paid for the current month during migration.
  return Boolean(bill.paid) && key === monthKey();
}

export function toggleBillMonth(bill, date = new Date()) {
  const key = monthKey(date);
  const paidMonths = Array.isArray(bill.paidMonths)
    ? bill.paidMonths
    : (bill.paid ? [monthKey()] : []);
  const isPaid = paidMonths.includes(key);
  const nextMonths = isPaid
    ? paidMonths.filter((month) => month !== key)
    : [...paidMonths, key];

  return {
    ...bill,
    paidMonths: nextMonths,
    paid: nextMonths.includes(monthKey()),
  };
}
