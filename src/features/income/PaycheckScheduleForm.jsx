import { useState } from "react";
import { Button, Modal } from "../../ui";
import { DEPOSIT_METHODS, PAY_FREQUENCIES } from "./constants";
import { nextExpectedPayDate, validatePaycheckSchedule } from "./paycheckSchedules";

const empty = {
  employer: "", payFrequency: "", preferredWeekday: "", anchorDate: "",
  semimonthlyPattern: "first-fifteenth", semimonthlyDayOne: 1, semimonthlyDayTwo: 15,
  monthlyDay: 1, useLastDayOfMonth: false, defaultHourlyRate: "", defaultRegularHours: "",
  defaultOvertimeHours: "", defaultOvertimeMultiplier: 1.5, defaultGrossPay: "",
  defaultDeductions: "", defaultDepositMethod: "", nextExpectedPayDate: "", isActive: true,
};
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function PaycheckScheduleForm({ open, schedule, onClose, onSave }) {
  const [values, setValues] = useState(() => schedule ? { ...empty, ...schedule } : empty);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const change = ({ target }) => setValues((previous) => ({ ...previous, [target.name]: target.type === "checkbox" ? target.checked : target.value }));
  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    const nextValues = !values.nextExpectedPayDate && values.anchorDate
      ? { ...values, nextExpectedPayDate: nextExpectedPayDate({ ...values, isActive: true }, values.anchorDate) }
      : values;
    const nextErrors = validatePaycheckSchedule(nextValues);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true); await onSave(nextValues); setSaving(false);
  }
  const recurring = ["weekly", "biweekly", "semimonthly", "monthly"].includes(values.payFrequency);
  return <Modal open={open} onClose={() => !saving && onClose()} title={schedule ? "Edit paycheck schedule" : "New paycheck schedule"} description="Schedules forecast expected paychecks. They never count as received income." size="lg">
    <form className="income-form-page" onSubmit={submit} noValidate>
      <div className="income-form-grid">
        <div className="income-field"><label htmlFor="schedule-employer">Employer</label><input id="schedule-employer" name="employer" value={values.employer} onChange={change} aria-invalid={Boolean(errors.employer)} />{errors.employer && <small className="field-error">{errors.employer}</small>}</div>
        <div className="income-field"><label htmlFor="schedule-frequency">Pay frequency</label><select id="schedule-frequency" name="payFrequency" value={values.payFrequency} onChange={change} aria-invalid={Boolean(errors.payFrequency)}><option value="">Select frequency</option>{PAY_FREQUENCIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>{errors.payFrequency && <small className="field-error">{errors.payFrequency}</small>}</div>
      </div>
      {recurring && <div className="income-form-grid" aria-live="polite">
        {(values.payFrequency === "weekly" || values.payFrequency === "biweekly") && <div className="income-field"><label htmlFor="schedule-weekday">Preferred pay day</label><select id="schedule-weekday" name="preferredWeekday" value={values.preferredWeekday} onChange={change}><option value="">Not specified</option>{weekdays.map((day, index) => <option key={day} value={index}>{day}</option>)}</select></div>}
        <div className="income-field"><label htmlFor="schedule-anchor">Schedule anchor date</label><input id="schedule-anchor" type="date" name="anchorDate" value={values.anchorDate || ""} onChange={change} />{errors.anchorDate && <small className="field-error">{errors.anchorDate}</small>}</div>
        <div className="income-field"><label htmlFor="schedule-next">Next expected pay date</label><input id="schedule-next" type="date" name="nextExpectedPayDate" value={values.nextExpectedPayDate || ""} onChange={change} /><small>Required for forecasts; leave blank if unknown.</small></div>
      </div>}
      {values.payFrequency === "semimonthly" && <><div className="income-field"><label htmlFor="schedule-pattern">Twice-monthly pattern</label><select id="schedule-pattern" name="semimonthlyPattern" value={values.semimonthlyPattern} onChange={change}><option value="first-fifteenth">1st and 15th</option><option value="fifteenth-last">15th and Last Day</option><option value="custom">Custom days</option></select></div>{values.semimonthlyPattern === "custom" && <div className="income-form-grid"><div className="income-field"><label htmlFor="schedule-day-one">Day 1</label><input id="schedule-day-one" type="number" min="1" max="31" name="semimonthlyDayOne" value={values.semimonthlyDayOne} onChange={change} />{errors.semimonthlyDayOne && <small className="field-error">{errors.semimonthlyDayOne}</small>}</div><div className="income-field"><label htmlFor="schedule-day-two">Day 2</label><input id="schedule-day-two" type="number" min="1" max="31" name="semimonthlyDayTwo" value={values.semimonthlyDayTwo} onChange={change} />{errors.semimonthlyDayTwo && <small className="field-error">{errors.semimonthlyDayTwo}</small>}</div></div>}</>}
      {values.payFrequency === "monthly" && <div className="income-form-grid"><label><input type="checkbox" name="useLastDayOfMonth" checked={values.useLastDayOfMonth} onChange={change} /> Use last day of month</label>{!values.useLastDayOfMonth && <div className="income-field"><label htmlFor="schedule-monthly-day">Day of month</label><input id="schedule-monthly-day" type="number" min="1" max="31" name="monthlyDay" value={values.monthlyDay} onChange={change} />{errors.monthlyDay && <small className="field-error">{errors.monthlyDay}</small>}</div>}</div>}
      <h3>Paycheck defaults (optional estimates)</h3><div className="income-form-grid">
        {["defaultHourlyRate", "defaultRegularHours", "defaultOvertimeHours", "defaultOvertimeMultiplier", "defaultGrossPay", "defaultDeductions"].map((name) => <div className="income-field" key={name}><label htmlFor={`schedule-${name}`}>{name.replace("default", "").replace(/([A-Z])/g, " $1").trim()}</label><input id={`schedule-${name}`} type="number" min="0" step="0.01" inputMode="decimal" name={name} value={values[name]} onChange={change} /></div>)}
        <div className="income-field"><label htmlFor="schedule-method">Deposit method</label><select id="schedule-method" name="defaultDepositMethod" value={values.defaultDepositMethod} onChange={change}><option value="">Not specified</option>{DEPOSIT_METHODS.map((method) => <option key={method}>{method}</option>)}</select></div>
      </div>
      <div className="income-form-actions"><Button variant="secondary" onClick={onClose} disabled={saving}>Cancel</Button><Button type="submit" loading={saving}>Save schedule</Button></div>
    </form>
  </Modal>;
}
export default PaycheckScheduleForm;
