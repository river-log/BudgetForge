import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import "../components/Modal.css";

import SavingsSummaryWidget from "../widgets/SavingsSummaryWidget";
import SavingsGoalCard from "../widgets/SavingsGoalCard";
import AddSavingsGoal from "../widgets/AddSavingsGoal";

function SavingsPage() {
  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem(
      "budgetforge-savings"
    );

    return saved ? JSON.parse(saved) : [];
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "budgetforge-savings",
      JSON.stringify(goals)
    );
  }, [goals]);

  function addGoal(goal) {
    setGoals((prev) => [...prev, goal]);
  }

  function openDeposit(id) {
    setSelectedGoal(id);
    setModalMode("deposit");
    setAmount("");
    setModalOpen(true);
  }

  function openWithdraw(id) {
    setSelectedGoal(id);
    setModalMode("withdraw");
    setAmount("");
    setModalOpen(true);
  }

  function submitTransaction() {
    const value = Number(amount);

    if (!value || value <= 0) return;

    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== selectedGoal) {
          return goal;
        }

        return {
          ...goal,
          saved:
            modalMode === "deposit"
              ? goal.saved + value
              : Math.max(goal.saved - value, 0),
        };
      })
    );

    setModalOpen(false);
    setAmount("");
    setSelectedGoal(null);
  }

  return (
    <>
      <div className="dashboard-header">
        <h1>🏦 Savings</h1>

        <p className="text-muted">
          Build savings goals and track your
          progress.
        </p>
      </div>

      <SavingsSummaryWidget goals={goals} />

      <div
        className="widget-grid"
        style={{ marginTop: "24px" }}
      >
        <AddSavingsGoal
          addGoal={addGoal}
        />

        {goals.map((goal) => (
          <SavingsGoalCard
            key={goal.id}
            goal={goal}
            onDeposit={openDeposit}
            onWithdraw={openWithdraw}
          />
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          modalMode === "deposit"
            ? "💰 Deposit Funds"
            : "➖ Withdraw Funds"
        }
      >
        <p>
          Enter the amount you would like to{" "}
          {modalMode}.
        </p>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          autoFocus
        />

        <div className="modal-actions">
          <button
            className="secondary"
            onClick={() =>
              setModalOpen(false)
            }
          >
            Cancel
          </button>

          <button
            onClick={submitTransaction}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
}

export default SavingsPage;