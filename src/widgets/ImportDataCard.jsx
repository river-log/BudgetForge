function ImportDataCard() {
  function importData(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);

        if (
          !backup.version ||
          !backup.exportDate
        ) {
          alert("Invalid BudgetForge backup.");
          return;
        }

        localStorage.setItem(
          "monthlyIncome",
          JSON.stringify(backup.income)
        );

        localStorage.setItem(
          "budgetforge-bills",
          JSON.stringify(backup.bills || [])
        );

        localStorage.setItem(
          "budgetforge-savings",
          JSON.stringify(backup.savings || [])
        );

        localStorage.setItem(
          "budgetforge-debts",
          JSON.stringify(backup.debts || [])
        );

        alert(
          "Backup restored successfully!\n\nBudgetForge will now reload."
        );

        window.location.reload();
      } catch {
        alert(
          "This is not a valid BudgetForge backup."
        );
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className="widget">
      <h2>📂 Restore Backup</h2>

      <p className="text-muted">
        Import a previously exported
        BudgetForge backup.
      </p>

      <input
        type="file"
        accept=".json"
        onChange={importData}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
}

export default ImportDataCard;