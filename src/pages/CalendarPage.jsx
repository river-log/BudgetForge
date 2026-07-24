import { useMemo, useState } from "react";
import { Bell, CalendarDays, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";

const REMINDER_KEY = "budgetforge-reminder-days";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(value) || 0);
}

function billDateInMonth(bill, year, month) {
  const source = new Date(`${bill.dueDate}T12:00:00`);
  if (Number.isNaN(source.getTime())) return null;
  const maxDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(source.getDate(), maxDay), 12);
}

function CalendarPage({ bills, togglePaid }) {
  const [cursor, setCursor] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [reminderDays, setReminderDays] = useState(() => Number(localStorage.getItem(REMINDER_KEY) || 3));
  const [notificationState, setNotificationState] = useState(() => ("Notification" in window ? Notification.permission : "unsupported"));

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthLabel = cursor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstWeekday = new Date(year, month, 1).getDay();

  const monthBills = useMemo(() => bills.map((bill) => ({ ...bill, calendarDate: billDateInMonth(bill, year, month) })).filter((bill) => bill.calendarDate), [bills, year, month]);
  const timeline = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bills.map((bill) => {
      const due = billDateInMonth(bill, today.getFullYear(), today.getMonth());
      if (due < today) due.setMonth(due.getMonth() + 1);
      return { ...bill, nextDue: due };
    }).filter((bill) => (bill.nextDue - today) / 86400000 <= 30).sort((left, right) => left.nextDue - right.nextDue);
  }, [bills]);

  const reminders = timeline.filter((bill) => {
    const daysAway = Math.ceil((bill.nextDue - new Date().setHours(0, 0, 0, 0)) / 86400000);
    return !bill.paid && daysAway <= reminderDays;
  });

  function updateReminderDays(value) {
    const days = Math.max(0, Number(value) || 0);
    setReminderDays(days);
    localStorage.setItem(REMINDER_KEY, String(days));
  }

  async function enableReminders() {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotificationState(permission);
    if (permission === "granted" && reminders.length) {
      new Notification("BudgetForge bill reminder", {
        body: `${reminders.length} bill${reminders.length === 1 ? " is" : "s are"} due within ${reminderDays} day${reminderDays === 1 ? "" : "s"}.`,
      });
    }
  }

  const calendarCells = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => index < firstWeekday ? null : index - firstWeekday + 1);

  return (
    <>
      <div className="dashboard-header">
        <div><h1>Calendar</h1><p className="text-muted">See due dates, upcoming payments, and reminders in one place.</p></div>
      </div>

      <section className="calendar-layout">
        <div className="panel calendar-panel">
          <div className="calendar-controls">
            <button className="icon-button" aria-label="Previous month" onClick={() => setCursor(new Date(year, month - 1, 1))}><ChevronLeft size={20} /></button>
            <h2>{monthLabel}</h2>
            <button className="icon-button" aria-label="Next month" onClick={() => setCursor(new Date(year, month + 1, 1))}><ChevronRight size={20} /></button>
          </div>
          <div className="calendar-weekdays">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="calendar-grid">
            {calendarCells.map((day, index) => {
              const items = day ? monthBills.filter((bill) => bill.calendarDate.getDate() === day) : [];
              return <div className="calendar-day" key={`${day}-${index}`}>
                {day && <><span className="calendar-date">{day}</span>{items.map((bill) => <button key={bill.id} className={`calendar-bill ${bill.paid ? "paid" : ""}`} title={`${bill.name}: ${formatCurrency(bill.amount)}`} onClick={() => togglePaid(bill.id)}>{bill.name}</button>)}</>}
              </div>;
            })}
          </div>
          <p className="calendar-note">Select a bill to mark it paid or unpaid.</p>
        </div>

        <aside className="widget reminders-panel">
          <div className="reminders-title"><Bell size={23} aria-hidden="true" /><h2>Bill reminders</h2></div>
          <p>Remind me when a bill is due within:</p>
          <select value={reminderDays} onChange={(event) => updateReminderDays(event.target.value)}>
            <option value="0">Due today</option><option value="1">1 day</option><option value="3">3 days</option><option value="7">1 week</option><option value="14">2 weeks</option>
          </select>
          <button onClick={enableReminders} disabled={notificationState === "unsupported" || notificationState === "denied"}>
            <Bell size={18} /> {notificationState === "granted" ? "Reminders enabled" : notificationState === "denied" ? "Blocked by browser" : "Enable reminders"}
          </button>
          <div className="reminder-list">
            {reminders.length ? reminders.map((bill) => <div key={bill.id}><strong>{bill.name}</strong><span>{bill.nextDue.toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {formatCurrency(bill.amount)}</span></div>) : <p className="text-muted">No unpaid bills are due in this reminder window.</p>}
          </div>
        </aside>
      </section>

      <section className="panel timeline-panel">
        <div className="timeline-heading"><div><Clock3 size={22} aria-hidden="true" /><h2>Upcoming payment timeline</h2></div><span>Next 30 days</span></div>
        {timeline.length ? <div className="timeline-list">{timeline.map((bill) => <div className={`timeline-row ${bill.paid ? "paid" : ""}`} key={bill.id}><div className="timeline-date"><strong>{bill.nextDue.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</strong><span>{Math.max(0, Math.ceil((bill.nextDue - new Date().setHours(0, 0, 0, 0)) / 86400000))} days</span></div><div><strong>{bill.name}</strong><span>{bill.category || "Other"}</span></div><strong>{formatCurrency(bill.amount)}</strong><button className="secondary-button" onClick={() => togglePaid(bill.id)}>{bill.paid ? "Paid" : "Mark paid"}</button></div>)}</div> : <div className="timeline-empty"><CalendarDays size={28} /><p>Add bills with due dates to create your payment timeline.</p></div>}
      </section>
    </>
  );
}

export default CalendarPage;
