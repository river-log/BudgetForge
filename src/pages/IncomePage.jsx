import { useMemo, useState } from "react";
import { BanknoteArrowDown, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button, EmptyState, Modal } from "../ui";
import { useBudget } from "../context";
import IncomeForm from "../features/income/IncomeForm";
import { DEPOSIT_METHODS, INCOME_SOURCE_TYPES } from "../features/income/constants";
import { filterIncome, formatIncomeCurrency, incomeSummary } from "../features/income/income";
import "../styles/income.css";

function IncomePage() {
  const { incomeEntries, addIncomeEntry, updateIncomeEntry, deleteIncomeEntry } = useBudget();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [details, setDetails] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [filters, setFilters] = useState({ query: "", sourceType: "", entryMode: "", depositMethod: "", month: "", year: "", sort: "newest" });
  const summary = useMemo(() => incomeSummary(incomeEntries), [incomeEntries]);
  const filtered = useMemo(() => filterIncome(incomeEntries, filters), [filters, incomeEntries]);
  const years = [...new Set(incomeEntries.map((entry) => entry.dateReceived?.slice(0, 4)).filter(Boolean))].sort().reverse();
  const setFilter = (event) => setFilters((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  async function save(values) {
    if (editing) updateIncomeEntry(editing.id, values);
    else addIncomeEntry(values);
    setFormOpen(false);
    setEditing(null);
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
          <div><time dateTime={entry.dateReceived}>{new Date(`${entry.dateReceived}T12:00:00`).toLocaleDateString("en-US")}</time><strong>{entry.sourceName}</strong><span>{entry.entryMode === "paycheck" ? "Detailed paycheck" : entry.sourceType} · {entry.depositMethod}{entry.notes ? " · Notes added" : ""}</span></div>
          <strong className="income-row__amount">{formatIncomeCurrency(entry.amount)}</strong>
          <div className="income-row__actions"><button onClick={() => setDetails(entry)} aria-label={`View ${entry.sourceName} details`}><Eye size={18} aria-hidden="true" /></button><button onClick={() => { setEditing(entry); setFormOpen(true); }} aria-label={`Edit ${entry.sourceName}`}><Pencil size={18} aria-hidden="true" /></button><button onClick={() => setDeleting(entry)} aria-label={`Delete ${entry.sourceName}`}><Trash2 size={18} aria-hidden="true" /></button></div>
        </article>)}</div>}
    </section>
    <IncomeForm key={`${editing?.id || "new"}-${formOpen}`} open={formOpen} entry={editing} onClose={() => { setFormOpen(false); setEditing(null); }} onSave={save} />
    <Modal open={Boolean(details)} onClose={() => setDetails(null)} title={details?.sourceName || "Income details"}>
      {details && <dl className="income-details"><div><dt>Date received</dt><dd>{details.dateReceived}</dd></div><div><dt>Amount received</dt><dd>{formatIncomeCurrency(details.amount)}</dd></div><div><dt>Deposit method</dt><dd>{details.depositMethod}</dd></div>{details.entryMode === "paycheck" && <><div><dt>Pay period</dt><dd>{details.payPeriodStart} – {details.payPeriodEnd}</dd></div><div><dt>Hourly rate</dt><dd>{formatIncomeCurrency(details.hourlyRate)}</dd></div><div><dt>Hours</dt><dd>{details.regularHours} regular, {details.overtimeHours} overtime</dd></div><div><dt>Gross pay</dt><dd>{formatIncomeCurrency(details.grossPay)}</dd></div><div><dt>Total deductions</dt><dd>{formatIncomeCurrency(details.totalDeductions)}</dd></div><div><dt>Net pay</dt><dd>{formatIncomeCurrency(details.netPay)}</dd></div></>}{details.notes && <div><dt>Notes</dt><dd>{details.notes}</dd></div>}</dl>}
    </Modal>
    <Modal open={Boolean(deleting)} onClose={() => setDeleting(null)} title="Delete income entry?" description="This removes the entry from Income, Dashboard totals, Reports, backups, and cloud sync." footer={<><Button variant="secondary" onClick={() => setDeleting(null)}>Cancel</Button><Button variant="danger" onClick={() => { deleteIncomeEntry(deleting.id); setDeleting(null); }}>Delete income</Button></>}>
      <p>{deleting && `${deleting.sourceName} — ${formatIncomeCurrency(deleting.amount)}`}</p>
    </Modal>
  </div>;
}

export default IncomePage;
