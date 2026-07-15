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
  const [selectedGoal, setSelectedGoal] =
    useState(null);

  const [amount, setAmount] = useState("");

  const [editName, setEditName] =
    useState("");

  const [editTarget, setEditTarget] =
    useState("");

  const [editSaved, setEditSaved] =
    useState("");

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

  function openDelete(id) {
    setSelectedGoal(id);
    setModalMode("delete");
    setModalOpen(true);
  }

  function openEdit(goal) {
    setSelectedGoal(goal.id);

    setEditName(goal.name);
    setEditTarget(goal.target);
    setEditSaved(goal.saved);

    setModalMode("edit");
    setModalOpen(true);
  }

  function submitModal() {
    if (modalMode === "delete") {
      setGoals((prev) =>
        prev.filter(
          (goal) =>
            goal.id !== selectedGoal
        )
      );

      closeModal();
      return;
    }
if (modalMode === "edit") {
  setGoals((prev) =>
    prev.map((goal) => {
      if (
        goal.id !== selectedGoal
      ) {
        return goal;
      }

      return {
        ...goal,
        name: editName,
        target: Number(editTarget),
        saved: Number(editSaved),
      };
    })
  );

  closeModal();
  return;
}

    const value = Number(amount);

    if (!value || value <= 0) return;

    setGoals((prev) =>
      prev.map((goal) => {
        if (
          goal.id !== selectedGoal
        ) {
          return goal;
        }

        return {
          ...goal,
          saved:
            modalMode === "deposit"
              ? goal.saved + value
              : Math.max(
                  goal.saved - value,
                  0
                ),
        };
      })
    );

    closeModal();
  }

  function closeModal() {
    setModalOpen(false);

    setSelectedGoal(null);

    setAmount("");

    setEditName("");

    setEditTarget("");

    setEditSaved("");
  }

  return (
    <>
      <div className="dashboard-header">
        <h1>🏦 Savings</h1>

        <p className="text-muted">
          Build savings goals and
          track your progress.
        </p>
      </div>

      <SavingsSummaryWidget
        goals={goals}
      />

      <div
        className="widget-grid"
        style={{
          marginTop: "24px",
        }}
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
            onDelete={openDelete}
            onEdit={openEdit}
          />
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          modalMode === "deposit"
            ? "💰 Deposit Funds"
            : modalMode === "withdraw"
            ? "➖ Withdraw Funds"
            : modalMode === "edit"
            ? "✏️ Edit Goal"
            : "🗑 Delete Goal"
        }
      >
        {modalMode === "delete" ? (
          <>
            <p>
              Are you sure you want to
              permanently delete this
              savings goal?
            </p>

            <div className="modal-actions">
              <button
                className="secondary"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                style={{
                  background: "#ED4245",
                }}
                onClick={submitModal}
              >
                Delete Goal
              </button>
            </div>
          </>
        ) : modalMode === "edit" ? (
          <>
            <input
              type="text"
              placeholder="Goal Name"
              value={editName}
              onChange={(e) =>
                setEditName(e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Target Amount"
              value={editTarget}
              onChange={(e) =>
                setEditTarget(e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Current Saved"
              value={editSaved}
              onChange={(e) =>
                setEditSaved(e.target.value)
              }
            />

            <div className="modal-actions">
              <button
                className="secondary"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                onClick={submitModal}
              >
                Save Changes
              </button>
            </div>
          </>
        ) : (
          <>
            <p>
              Enter the amount you would
              like to {modalMode}.
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
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                onClick={submitModal}
              >
                Confirm
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

export default SavingsPage;