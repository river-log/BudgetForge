import { Link } from "react-router-dom";
import { CalendarClock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, EmptyState } from "../ui";
import { PAY_FREQUENCY_LABELS } from "../features/income/constants";
import { estimatedSchedulePaycheck } from "../features/income/paycheckSchedules";
import { formatStoredDateSafely } from "../utils/storedDates";

function ExpectedPaycheckWidget({ schedules }) {
  const next = (Array.isArray(schedules) ? schedules : []).filter((item) => item.isActive && item.nextExpectedPayDate).sort((a, b) => a.nextExpectedPayDate.localeCompare(b.nextExpectedPayDate))[0];
  const estimate = estimatedSchedulePaycheck(next);
  return <Card className="widget" padding="lg"><CardHeader><CardTitle>Next expected paycheck</CardTitle><CalendarClock aria-hidden="true" /></CardHeader><CardContent>{!next ? <EmptyState title="No expected paycheck" description="Add an active paycheck schedule from Income." /> : <><p><strong>{next.employer}</strong></p><p>{formatStoredDateSafely(next.nextExpectedPayDate)} · {PAY_FREQUENCY_LABELS[next.payFrequency]}</p><p>{estimate ? `Estimated paycheck: ${estimate.toLocaleString("en-US", { style: "currency", currency: "USD" })}` : "Estimated amount unavailable"}</p><Link to="/income">Review and record paycheck</Link></>}</CardContent></Card>;
}
export default ExpectedPaycheckWidget;
