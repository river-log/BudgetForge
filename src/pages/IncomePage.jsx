import { useMemo, useState } from "react";
import { BanknoteArrowDown, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button, EmptyState, Modal } from "../ui";
import { useBudget } from "../context";
import IncomeForm from "../features/income/IncomeForm";
import PaycheckScheduleForm from "../features/income/PaycheckScheduleForm";
import { DEPOSIT_METHODS, INCOME_SOURCE_TYPES, PAY_FREQUENCY_LABELS } from "../features/income/constants";
import { filterIncome, formatIncomeCurrency, incomeSummary } from "../features/income/income";
import { estimatedSchedulePaycheck, prefillPaycheckFromSchedule } from "../features/income/paycheckSchedules";
import "../styles/income.css";

function IncomePage() {
  const { incomeEntries, addIncomeEntry, updateIncomeEntry, deleteIncomeEntry, paycheckSchedules = [], addPaycheckSchedule, updatePaycheckSchedule, togglePaycheckSchedule, deletePaycheckSchedule, advancePaycheckSchedule } = useBudget();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [details, setDetails] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [schedulePrefill, setSchedulePrefill] = useState(null);
  const [filters, setFilters] = useState({ query: "", sourceType: "", entryMode: "", depositMethod: "", month: "", year: "", sort: "newest" });
  const summary = useMemo(() => incomeSummary(incomeEntries), [incomeEntries]);
  const filtered = useMemo(() => filterIncome(incomeEntries, filters), [filters, incomeEntries]);
  const years = [...new Set(incomeEntries.map((entry) => entry.dateReceived?.slice(0, 4)).filter(Boolean))].sort().reverse();
  const setFilter = (event) => setFilters((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  async function save(values) {
    if (editing) updateIncomeEntry(editing.id, values);
    else {
      const result = addIncomeEntry(values);
      if (result.entry?.scheduleId) advancePaycheckSchedule(result.entry.scheduleId, result.entry.dateReceived);
    }
    setFormOpen(false);
    setEditing(null);
  }
  async function saveSchedule(values) {
    if (editingSchedule) updatePaycheckSchedule(editingSchedule.id, values);
    else addPaycheckSchedule(values);
    setScheduleFormOpen(false);
    setEditingSchedule(null);
  }
  return <div className="workspace-page income-page">
    <header className="workspace-header"><div><h1>Income</h1><p>Record deposits and paychecks, then understand what entered your accounts.</p></div><Button leftIcon={<Plus size={18} aria-hidden="true" />} onClick={() => { setEditing(null); setFormOpen(true); }}>Add Income</Button></header>
    <section className="income-summary-grid" aria-label="Income summary">
      <div><span>Income This Month</span><strong>{formatIncomeCurrency(summary.monthIncome)}</strong></div>
      <div><span>Income This Year</span><strong>{formatIncomeCurrency(summary.yearIncome)}</strong></div>
      <div><span>Entries This Month</span><strong>{summary.monthCount}</strong></div>
      <div><span>Average Paycheck</span><strong>{formatIncomeCurrency(summary.averagePaycheck)}</strong></div>
      <div><span>Largest Entry</span><strong>{formatIncomeCurrency(summary.largestIncome)}</strong></div>
    </section>
    <section className="panel income-history" aria-labelledby="paycheck-schedules-heading">
      <div className="chart-heading"><div><h2 id="paycheck-schedules-heading">Paycheck schedules</h2><p>Expected paychecks are estimates and never count as received income.</p></div><Button onClick={() => { setEditingSchedule(null); setScheduleFormOpen(true); }}>Add schedule</Button></div>
      {!paycheckSchedules.length ? <EmptyState title="No paycheck schedules" description="Add a schedule to forecast expected pay dates without creating income." /> : <div className="income-list">{paycheckSchedules.map((schedule) => {
        const estimate = estimatedSchedulePaycheck(schedule);
        return <article className="income-row" key={schedule.id}><div><strong>{schedule.employer}</strong><span>{PAY_FREQUENCY_LABELS[schedule.payFrequency] || "Frequency not recorded"} · {schedule.isActive ? "Active" : "Paused"}</span><span>{schedule.nextExpectedPayDate ? `Next expected: ${schedule.nextExpectedPayDate}` : "Next expected date unavailable"}{estimate ? ` · Estimated paycheck ${formatIncomeCurrency(estimate)}` : ""}</span></div><div className="income-row__actions"><Button size="sm" disabled={!schedule.isActive} onClick={() => { setSchedulePrefill(prefillPaycheckFromSchedule(schedule)); setEditing(null); setFormOpen(true); }}>Record paycheck</Button><Button size="sm" variant="secondary" onClick={() => togglePaycheckSchedule(schedule.id)}>{schedule.isActive ? "Pause" : "Resume"}</Button><button onClick={() => { setEditingSchedule(schedule); setScheduleFormOpen(true); }} aria-label={`Edit ${schedule.employer} schedule`}><Pencil size={18} aria-hidden="true" /></button><button onClick={() => deletePaycheckSchedule(schedule.id)} aria-label={`Delete ${schedule.employer} schedule`}><Trash2 size={18} aria-hidden="true" /></button></div></article>;
      })}</div>}
    </section>
    <section className="panel income-toolbar" aria-label="Search and filter income">
      <label className="income-search"><span className="sr-only">Search income</span><Search size={18} aria-hidden="true" /><input name="query" value={filters.query} onChange={setFilter} placeholder="Search employer, source, or notes" /></label>
      <select aria-label="Source type" name="sourceType" value={filters.sourceType} onChange={setFilter}><option value="">All sources</option>{INCOME_SOURCE_TYPES.map((value) => <option key={value}>{value}</option>)}</select>
      <select aria-label="Entry mode" name="entryMode" value={filters.entryMode} onChange={setFilter}><option value="">All entry modes</option><option value="quick">Quick deposits</option><option value="paycheck">Paychecks</option></select>
      <select aria-label="Deposit method" name="depositMethod" value={filters.depositMethod} onChange={setFilter}><option value="">All methods</option>{DEPOSIT_METHODS.map((value) => <option key={value}>{value}</option>)}</select>
      <select aria-label="Month" name="month" value={filters.month} onChange={setFilter}><option value="">All months</option>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>{new Date(2020, index, 1).toLocaleDateString("en-US", { month: "long" })}</option>)}</select>
      <select aria-label="Year" name="year" value={filters.year} onChange={setFilter}><option value="">All years</option>{years.map((year) => <option key={year}>{year}</option>)}</select>
      <select aria-label="Sort income" name="sort" value={filters.sort} onChange={setFilter}><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="highest">Highest amount</option><option value="lowest">Lowest amount</option></select>
    </section>
    <section className="panel income-history" aria-labelledby="income-history-heading">
      <h2 id="income-history-heading">Income history</h2>
      {!incomeEntries.length ? <EmptyState icon={<BanknoteArrowDown size={28} aria-hidden="true" />} title="No income recorded yet" description="Add a quick deposit or detailed paycheck to begin tracking income." action={<Button onClick={() => setFormOpen(true)}>Add your first income</Button>} /> : !filtered.length ? <EmptyState title="No matching income" description="Try changing your search or filters." /> :
        <div className="income-list">{filtered.map((entry) => <article className="income-row" key={entry.id}>
          <div><time dateTime={entry.dateReceived}>{new Date(`${entry.dateReceived}T12:00:00`).toLocaleDateString("en-US")}</time><strong>{entry.sourceName}</strong><span>{entry.entryMode === "paycheck" ? `Detailed paycheck · ${PAY_FREQUENCY_LABELS[entry.payFrequency] || "Frequency not recorded"}${entry.scheduleId ? " · From paycheck schedule" : ""}` : entry.sourceType} · {entry.depositMethod}{entry.notes ? " · Notes added" : ""}</span></div>
          <strong className="income-row__amount">{formatIncomeCurrency(entry.amount)}</strong>
          <div className="income-row__actions"><button onClick={() => setDetails(entry)} aria-label={`View ${entry.sourceName} details`}><Eye size={18} aria-hidden="true" /></button><button onClick={() => { setEditing(entry); setFormOpen(true); }} aria-label={`Edit ${entry.sourceName}`}><Pencil size={18} aria-hidden="true" /></button><button onClick={() => setDeleting(entry)} aria-label={`Delete ${entry.sourceName}`}><Trash2 size={18} aria-hidden="true" /></button></div>
        </article>)}</div>}
    </section>
    <IncomeForm key={`${editing?.id || schedulePrefill?.scheduleId || "new"}-${formOpen}`} open={formOpen} entry={editing} initialValues={schedulePrefill} onClose={() => { setFormOpen(false); setEditing(null); setSchedulePrefill(null); }} onSave={save} />
    <PaycheckScheduleForm key={`${editingSchedule?.id || "new"}-${scheduleFormOpen}`} open={scheduleFormOpen} schedule={editingSchedule} onClose={() => { setScheduleFormOpen(false); setEditingSchedule(null); }} onSave={saveSchedule} />
    <Modal open={Boolean(details)} onClose={() => setDetails(null)} title={details?.sourceName || "Income details"}>
      {details && <dl className="income-details"><div><dt>Date received</dt><dd>{details.dateReceived}</dd></div><div><dt>Amount received</dt><dd>{formatIncomeCurrency(details.amount)}</dd></div><div><dt>Deposit method</dt><dd>{details.depositMethod}</dd></div>{details.entryMode === "paycheck" && <><div><dt>Pay period</dt><dd>{details.payPeriodStart} – {details.payPeriodEnd}</dd></div><div><dt>Hourly rate</dt><dd>{formatIncomeCurrency(details.hourlyRate)}</dd></div><div><dt>Hours</dt><dd>{details.regularHours} regular, {details.overtimeHours} overtime</dd></div><div><dt>Gross pay</dt><dd>{formatIncomeCurrency(details.grossPay)}</dd></div><div><dt>Total deductions</dt><dd>{formatIncomeCurrency(details.totalDeductions)}</dd></div><div><dt>Net pay</dt><dd>{formatIncomeCurrency(details.netPay)}</dd></div></>}{details.notes && <div><dt>Notes</dt><dd>{details.notes}</dd></div>}</dl>}
    </Modal>
    <Modal open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Delete income entry?" description="This removes the entry from Income, Dashboard totals, Reports, backups, and cloud sync." footer={<><Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button><Button variant="danger" onClick={() => { deleteIncomeEntry(deleting.id); setDeleting(null); }}>Delete income</Button></>}>
      <p>{deleting && `${deleting.sourceName} — ${formatIncomeCurrency(deleting.amount)}`}</p>
    </Modal>
  </div>;
}

export default IncomePage;
