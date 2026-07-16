function ExportDataCard() {
  function exportData() {
    const backup = {
      version: "18.0",
      exportDate: new Date().toISOString(),

      income: JSON.parse(
        localStorage.getItem("monthlyIncome") || "0"
      ),

      bills: JSON.parse(
        localStorage.getItem("budgetforge-bills") || "[]"
      ),

      savings: JSON.parse(
        localStorage.getItem("budgetforge-savings") || "[]"
      ),

      debts: JSON.parse(
        localStorage.getItem("budgetforge-debts") || "[]"
      ),
    };

    const blob = new Blob(
      [JSON.stringify(backup, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const date = new Date()
      .toISOString()
      .split("T")[0];

    link.href = url;

    link.download = `BudgetForge-${date}.json`;

    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="widget">
      <h2>💾 Export Backup</h2>

      <p className="text-muted">
        Download a complete backup of your
        BudgetForge data.
      </p>

      <button
        style={{ marginTop: "20px" }}
        onClick={exportData}
      >
        Export Backup
      </button>
    </div>
  );
}

export default ExportDataCard;