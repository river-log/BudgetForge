const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseStoredDate(value) {
  if (typeof value !== "string") return null;
  const match = DATE_PATTERN.exec(value);
  if (!match) return null;
  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(year, month - 1, day, 12);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

export function isValidStoredDate(value) {
  return parseStoredDate(value) !== null;
}

export function formatStoredDateSafely(value, options = { month: "short", day: "numeric", year: "numeric" }) {
  const date = parseStoredDate(value);
  return date ? date.toLocaleDateString("en-US", options) : "Invalid date";
}

export function storedDateInMonth(value, year, month) {
  const source = parseStoredDate(value);
  if (!source) return null;
  const maxDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(source.getDate(), maxDay), 12);
}
