import { useMemo, useState } from "react";
import { Button, Modal } from "../../ui";
import { DEPOSIT_METHODS, INCOME_SOURCE_TYPES } from "./constants";
import { calculatePaycheck, validateIncome } from "./income";

const today = () => new Date().toISOString().slice(0, 10);
const empty = { entryMode: "quick", sourceType: "", sourceName: "", amount: "", dateReceived: today(), depositMethod: "", notes: "", employer: "", payPeriodStart: "", payPeriodEnd: "", hourlyRate: "", regularHours: "", overtimeHours: "", overtimeMultiplier: 1.5, grossPay: "", federalTax: "", stateTax: "", localTax: "", socialSecurityTax: "", medicareTax: "", healthInsurance: "", retirementContribution: "", otherDeductions: "" };
const moneyFields = [["federalTax", "Federal tax"], ["stateTax", "State tax"], ["localTax", "Local tax"], ["socialSecurityTax", "Social Security tax"], ["medicareTax", "Medicare tax"], ["healthInsurance", "Health insurance"], ["retirementContribution", "Retirement contribution"], ["otherDeductions", "Other deductions"]];

function Field({ label, name, value, onChange, error, type = "text", ...props }) {
  const errorId = `${name}-error`;
  return <div className="income-field"><label htmlFor={`income-${name}`}>{label}</label><input id={`income-${name}`} name={name} type={type} value={value} onChange={onChange} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props} />{error && <small id={errorId} className="field-error">{error}</small>}</div>;
}

function IncomeForm({ open, onClose, onSave, entry }) {
  const [values, setValues] = useState(() => entry ? { ...empty, ...entry } : empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [grossOverridden, setGrossOverridden] = useState(Boolean(entry?.entryMode === "paycheck"));
  const pay = useMemo(() => calculatePaycheck(values), [values]);
  function change(event) {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    if (name === "grossPay") setGrossOverridden(true);
    setErrors((previous) => ({ ...previous, [name]: undefined }));
  }
  function changeMode(mode) {
    setValues((previous) => ({ ...previous, entryMode: mode, sourceType: mode === "paycheck" ? "Paycheck" : previous.sourceType, grossPay: mode === "paycheck" && !grossOverridden ? "" : previous.grossPay }));
  }
  function resetGross() {
    setGrossOverridden(false);
    setValues((previous) => ({ ...previous, grossPay: "" }));
  }
  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    const nextErrors = validateIncome(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    await onSave(values);
    setSaving(false);
  }
  return <Modal open={open} onClose={() => !saving && onClose()} title={entry ? "Edit income" : "Add income"} description="Record a quick deposit or a detailed paycheck." size="lg">
    <form className="income-form-page" onSubmit={submit} noValidate>
      <fieldset className="income-mode"><legend>Entry mode</legend><button type="button" aria-pressed={values.entryMode === "quick"} onClick={() => changeMode("quick")}>Quick Deposit</button><button type="button" aria-pressed={values.entryMode === "paycheck"} onClick={() => changeMode("paycheck")}>Detailed Paycheck</button></fieldset>
      {values.entryMode === "quick" ? <>
        <div className="income-field"><label htmlFor="income-sourceType">Source type</label><select id="income-sourceType" name="sourceType" value={values.sourceType} onChange={change} aria-invalid={Boolean(errors.sourceType)} aria-describedby={errors.sourceType ? "sourceType-error" : undefined}><option value="">Select source</option>{INCOME_SOURCE_TYPES.map((value) => <option key={value}>{value}</option>)}</select>{errors.sourceType && <small id="sourceType-error" className="field-error">{errors.sourceType}</small>}</div>
        <Field label="Source name" name="sourceName" value={values.sourceName} onChange={change} error={errors.sourceName} />
        <Field label="Amount" name="amount" type="number" min="0" step="0.01" inputMode="decimal" value={values.amount} onChange={change} error={errors.amount} />
      </> : <>
        <Field label="Employer" name="employer" value={values.employer} onChange={change} error={errors.sourceName} />
        <div className="income-form-grid"><Field label="Pay period start" name="payPeriodStart" type="date" value={values.payPeriodStart} onChange={change} error={errors.payPeriodStart} /><Field label="Pay period end" name="payPeriodEnd" type="date" value={values.payPeriodEnd} onChange={change} error={errors.payPeriodEnd} /></div>
        <h3>Earnings</h3><div className="income-form-grid"><Field label="Hourly rate" name="hourlyRate" type="number" min="0" step="0.01" inputMode="decimal" value={values.hourlyRate} onChange={change} error={errors.hourlyRate} /><Field label="Regular hours" name="regularHours" type="number" min="0" step="0.01" inputMode="decimal" value={values.regularHours} onChange={change} error={errors.regularHours} /><Field label="Overtime hours" name="overtimeHours" type="number" min="0" step="0.01" inputMode="decimal" value={values.overtimeHours} onChange={change} error={errors.overtimeHours} /><Field label="Overtime multiplier" name="overtimeMultiplier" type="number" min="0" step="0.01" inputMode="decimal" value={values.overtimeMultiplier} onChange={change} error={errors.overtimeMultiplier} /></div>
        <p className="calculated-line">Estimated regular pay: ${pay.regularPay.toFixed(2)} · Overtime: ${pay.overtimePay.toFixed(2)} · Estimated gross: ${pay.estimatedGrossPay.toFixed(2)}</p>
        <div className="gross-control"><Field label="Gross pay" name="grossPay" type="number" min="0" step="0.01" inputMode="decimal" value={grossOverridden ? values.grossPay : pay.estimatedGrossPay} onChange={change} error={errors.grossPay} /><Button variant="secondary" onClick={resetGross}>Use estimate</Button></div>
        <h3>Deductions</h3><div className="income-form-grid">{moneyFields.map(([name, label]) => <Field key={name} label={label} name={name} type="number" min="0" step="0.01" inputMode="decimal" value={values[name]} onChange={change} error={errors[name]} />)}</div>
      </>}
      <div className="income-form-grid"><Field label="Date received" name="dateReceived" type="date" value={values.dateReceived} onChange={change} error={errors.dateReceived} /><div className="income-field"><label htmlFor="income-depositMethod">Deposit method</label><select id="income-depositMethod" name="depositMethod" value={values.depositMethod} onChange={change} aria-invalid={Boolean(errors.depositMethod)} aria-describedby={errors.depositMethod ? "depositMethod-error" : undefined}><option value="">Select method</option>{DEPOSIT_METHODS.map((value) => <option key={value}>{value}</option>)}</select>{errors.depositMethod && <small id="depositMethod-error" className="field-error">{errors.depositMethod}</small>}</div></div>
      <div className="income-field"><label htmlFor="income-notes">Notes (optional)</label><textarea id="income-notes" name="notes" value={values.notes} onChange={change} rows="3" /></div>
      {values.entryMode === "paycheck" && <dl className="paycheck-summary"><div><dt>Gross pay</dt><dd>${pay.grossPay.toFixed(2)}</dd></div><div><dt>Total deductions</dt><dd>${pay.totalDeductions.toFixed(2)}</dd></div><div><dt>Net pay</dt><dd>${pay.netPay.toFixed(2)}</dd></div></dl>}
      <div className="income-form-actions"><Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button><Button type="submit" loading={saving}>{entry ? "Save changes" : "Save income"}</Button></div>
    </form>
  </Modal>;
}

export default IncomeForm;
