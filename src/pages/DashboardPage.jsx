import DashboardHeader from "../widgets/DashboardHeader";
import WidgetGrid from "../widgets/WidgetGrid";
import IncomeWidget from "../widgets/IncomeWidget";
import QuickStatsWidget from "../widgets/QuickStatsWidget";
import UpcomingBillsWidget from "../widgets/UpcomingBillsWidget";
import RecentActivityWidget from "../widgets/RecentActivityWidget";

function DashboardPage({
  bills,
  monthlyIncome,
  userName,
  setUserName,
}) {
  return (
    <>
      {!userName && (
        <div
          className="panel"
          style={{ marginBottom: "30px" }}
        >
          <h2>👋 Welcome to BudgetForge OS</h2>

          <p
            style={{
              color: "var(--muted)",
              marginTop: "10px",
              marginBottom: "20px",
            }}
          >
            Before we get started, what should we call you?
          </p>

          <input
            type="text"
            placeholder="Enter your name..."
            value={userName}
            onChange={(e) =>
              setUserName(e.target.value)
            }
          />
        </div>
      )}

      <DashboardHeader userName={userName} />

      <WidgetGrid>

        <IncomeWidget
          income={monthlyIncome}
        />

        <QuickStatsWidget
          bills={bills}
        />

        <UpcomingBillsWidget
          bills={bills}
        />

        <RecentActivityWidget />

      </WidgetGrid>
    </>
  );
}

export default DashboardPage;