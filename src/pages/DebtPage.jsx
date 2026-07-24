import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import "../components/Modal.css";

import DebtSummaryWidget from "../widgets/DebtSummaryWidget";
import DebtCard from "../widgets/DebtCard";
import AddDebt from "../widgets/AddDebt";
import DebtStrategyWidget from "../widgets/DebtStrategyWidget";

function DebtPage() {
  const [debts, setDebts] = useState(() => {
    const saved = localStorage.getItem(
      "budgetforge-debts"
    );

    return saved ? JSON.parse(saved) : [];
  });

  const [modalOpen, setModalOpen] =
    useState(false);

  const [modalMode, setModalMode] =
    useState("");

  const [selectedDebt, setSelectedDebt] =
    useState(null);

  const [payment, setPayment] =
    useState("");

  const [strategy, setStrategy] = useState(() => (
    localStorage.getItem("budgetforge-debt-strategy") || "snowball"
  ));

  const [editName, setEditName] =
    useState("");

  const [editBalance, setEditBalance] =
    useState("");

  const [editAPR, setEditAPR] =
    useState("");

  const [editMinimum, setEditMinimum] =
    useState("");

  useEffect(() => {
    localStorage.setItem(
      "budgetforge-debts",
      JSON.stringify(debts)
    );
  }, [debts]);

  useEffect(() => {
    localStorage.setItem("budgetforge-debt-strategy", strategy);
  }, [strategy]);

  function addDebt(debt) {
    setDebts((prev) => [...prev, debt]);
  }

  function openPayment(id) {
    setSelectedDebt(id);

    setPayment("");

    setModalMode("payment");

    setModalOpen(true);
  }

  function openDelete(id) {
    setSelectedDebt(id);

    setModalMode("delete");

    setModalOpen(true);
  }

  function openEdit(debt) {
    setSelectedDebt(debt.id);

    setEditName(debt.name);

    setEditBalance(debt.balance);

    setEditAPR(debt.apr);

    setEditMinimum(debt.minimum);

    setModalMode("edit");

    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);

    setSelectedDebt(null);

    setPayment("");

    setEditName("");

    setEditBalance("");

    setEditAPR("");

    setEditMinimum("");
  }

  function submitModal() {
    if (modalMode === "delete") {
      setDebts((prev) =>
        prev.filter(
          (debt) =>
            debt.id !== selectedDebt
        )
      );

      closeModal();

      return;
    }

    if (modalMode === "edit") {
      if (
        !editName.trim() ||
        Number(editBalance) < 0 ||
        Number(editAPR) < 0 ||
        Number(editMinimum) < 0
      ) {
        return;
      }

      setDebts((prev) =>
        prev.map((debt) => {
          if (
            debt.id !== selectedDebt
          ) {
            return debt;
          }

          return {
            ...debt,
            name: editName.trim(),
            balance: Number(
              editBalance
            ),
            apr: Number(editAPR),
            minimum: Number(
              editMinimum
            ),
          };
        })
      );

      closeModal();

      return;
    }

    const value = Number(payment);

    if (!value || value <= 0) {
      return;
    }

    setDebts((prev) =>
      prev.map((debt) => {
        if (
          debt.id !== selectedDebt
        ) {
          return debt;
        }

        return {
          ...debt,
          balance: Math.max(
            debt.balance - value,
            0
          ),
        };
      })
    );

    closeModal();
  }

  return (
    <>
      <div className="dashboard-header">
        <h1>💳 Debt Payoff Planner</h1>

        <p className="text-muted">
          Track balances and build your
          path to becoming debt free.
        </p>
      </div>

      <DebtSummaryWidget debts={debts} />

      <DebtStrategyWidget
        debts={debts}
        strategy={strategy}
        setStrategy={setStrategy}
      />

      <div
        className="widget-grid"
        style={{
          marginTop: "24px",
        }}
      >
        <AddDebt
          addDebt={addDebt}
        />

        {debts.map((debt) => (
          <DebtCard
            key={debt.id}
            debt={debt}
            onPayment={openPayment}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          modalMode === "payment"
            ? "💰 Record Payment"
            : modalMode === "edit"
            ? "✏️ Edit Debt"
            : "🗑 Delete Debt"
        }
      >
        {modalMode === "delete" ? (
          <>
            <p>
              Are you sure you want to
              permanently delete this debt?
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
                Delete Debt
              </button>
            </div>
          </>
        ) : modalMode === "edit" ? (
          <>
            <input
              type="text"
              placeholder="Debt Name"
              value={editName}
              onChange={(e) =>
                setEditName(e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Current Balance"
              value={editBalance}
              onChange={(e) =>
                setEditBalance(e.target.value)
              }
            />

            <input
              type="number"
              step="0.01"
              placeholder="APR (%)"
              value={editAPR}
              onChange={(e) =>
                setEditAPR(e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Minimum Payment"
              value={editMinimum}
              onChange={(e) =>
                setEditMinimum(e.target.value)
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
              Enter the payment amount.
            </p>

            <input
              type="number"
              placeholder="Payment Amount"
              value={payment}
              onChange={(e) =>
                setPayment(e.target.value)
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
                Apply Payment
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

export default DebtPage;
