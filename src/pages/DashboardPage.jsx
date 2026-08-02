import { useState } from "react";
import { Handshake } from "lucide-react";
import DashboardHeader from "../widgets/DashboardHeader";
import WidgetGrid from "../widgets/WidgetGrid";
import IncomeWidget from "../widgets/IncomeWidget";
import QuickStatsWidget from "../widgets/QuickStatsWidget";
import RecentActivityWidget from "../widgets/RecentActivityWidget";
import CategoryPieChart from "../widgets/CategoryPieChart";
import ExpectedPaycheckWidget from "../widgets/ExpectedPaycheckWidget";
import FinancialHealthWidget from "../widgets/FinancialHealthWidget";
import BillsDueSoonWidget from "../widgets/BillsDueSoonWidget";
import HighestInterestDebtWidget from "../widgets/HighestInterestDebtWidget";
import SavingsInsightWidget from "../widgets/SavingsInsightWidget";
import NextActionWidget from "../widgets/NextActionWidget";
import { Button, Card, CardContent, CardHeader, CardTitle } from "../ui";
import { useBudget } from "../context";
import { useToast } from "../features/toasts";
import "../widgets/dashboard.css";

function DashboardPage() {
  const { bills, monthlyIncome, setMonthlyIncome, incomeMode, setIncomeMode, trackedMonthlyIncome, effectiveMonthlyIncome, userName, setUserName, paycheckSchedules, savingsGoals = [], debts = [] } = useBudget();
  const { showToast } = useToast();
  const [nameInput, setNameInput] = useState("");
  function saveName() {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setUserName(trimmed);
    showToast(`Welcome to BudgetForge, ${trimmed}!`, "success");
  }
  return <div className="dashboard-page">
    {!userName && <Card className="dashboard-welcome" variant="subtle" padding="lg"><CardHeader className="dashboard-widget__header"><div className="dashboard-widget__heading"><span className="dashboard-widget__icon"><Handshake size={19} aria-hidden="true" /></span><div><CardTitle className="dashboard-widget__title">Welcome to BudgetForge</CardTitle><p className="dashboard-widget__description">Before we get started, what should we call you?</p></div></div></CardHeader><CardContent className="dashboard-welcome__content"><label htmlFor="user-name" className="sr-only">Your name</label><input id="user-name" type="text" placeholder="Enter your name..." value={nameInput} onChange={(event) => setNameInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") saveName(); }} /><div><Button onClick={saveName}>Continue</Button></div></CardContent></Card>}
    <DashboardHeader userName={userName} />
    <WidgetGrid>
      <FinancialHealthWidget bills={bills} savingsGoals={savingsGoals} debts={debts} monthlyIncome={effectiveMonthlyIncome} />
      <BillsDueSoonWidget bills={bills} />
      <HighestInterestDebtWidget debts={debts} />
      <SavingsInsightWidget goals={savingsGoals} />
      <NextActionWidget bills={bills} debts={debts} savingsGoals={savingsGoals} />
      <IncomeWidget income={effectiveMonthlyIncome} manualIncome={monthlyIncome} trackedIncome={trackedMonthlyIncome} incomeMode={incomeMode} setIncomeMode={setIncomeMode} bills={bills} setIncome={setMonthlyIncome} />
      <ExpectedPaycheckWidget schedules={paycheckSchedules} />
      <QuickStatsWidget bills={bills} />
      <CategoryPieChart bills={bills} />
      <RecentActivityWidget />
    </WidgetGrid>
  </div>;
}
export default DashboardPage;
