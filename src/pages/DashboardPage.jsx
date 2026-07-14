import { useState } from "react";

import DashboardHeader from "../widgets/DashboardHeader";
import WidgetGrid from "../widgets/WidgetGrid";
import IncomeWidget from "../widgets/IncomeWidget";
import QuickStatsWidget from "../widgets/QuickStatsWidget";
import UpcomingBillsWidget from "../widgets/UpcomingBillsWidget";
import RecentActivityWidget from "../widgets/RecentActivityWidget";

function DashboardPage({
  bills,
  monthlyIncome,
  setMonthlyIncome,
  userName,
  setUserName,
}) {
  const [nameInput, setNameInput] = useState("");

  function saveName() {
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
    }
  }

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
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveName();
              }
            }}
          />

          <button
            style={{ marginTop: "15px" }}
            onClick={saveName}
          >
            Continue
          </button>
        </div>
      )}

      <DashboardHeader userName={userName} />

      <WidgetGrid>
        <IncomeWidget
          income={monthlyIncome}
          setIncome={setMonthlyIncome}
        />

        <QuickStatsWidget bills={bills} />

        <UpcomingBillsWidget bills={bills} />

        <RecentActivityWidget />
      </WidgetGrid>
    </>
  );
}

export default DashboardPage;