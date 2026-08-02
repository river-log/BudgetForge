import { useEffect, useState } from "react";
import { Modal } from "../ui";

import SavingsSummaryWidget from "../widgets/SavingsSummaryWidget";
import SavingsGoalCard from "../widgets/SavingsGoalCard";
import AddSavingsGoal from "../widgets/AddSavingsGoal";
import { recordSavingsSnapshot } from "../utils/history";
import { useBudget } from "../context";

function SavingsPage() {
  const { savingsGoals: goals, setSavingsGoals: setGoals } = useBudget();

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
    recordSavingsSnapshot(goals);
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
            <label htmlFor="edit-savings-name">Goal name</label>
            <input
              id="edit-savings-name"
              type="text"
              placeholder="Goal Name"
              value={editName}
              onChange={(e) =>
                setEditName(e.target.value)
              }
            />

            <label htmlFor="edit-savings-target">Target amount</label>
            <input
              id="edit-savings-target"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="Target Amount"
              value={editTarget}
              onChange={(e) =>
                setEditTarget(e.target.value)
              }
            />

            <label htmlFor="edit-savings-current">Current saved</label>
            <input
              id="edit-savings-current"
              type="number"
              min="0"
              step="0.01"
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

            <label htmlFor="savings-transaction-amount">Amount</label>
            <input
              id="savings-transaction-amount"
              type="number"
              min="0.01"
              step="0.01"
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
