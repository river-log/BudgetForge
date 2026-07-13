function DashboardHeader({ userName }) {
  const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";

    return "Good Evening";
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="dashboard-header">
      <div>
        <h1>
          {greeting()}
          {userName ? `, ${userName}` : ""} 👋
        </h1>

        <p>Welcome back to BudgetForge OS.</p>
      </div>

      <div className="today">
        <strong>{today}</strong>
      </div>
    </div>
  );
}

export default DashboardHeader;