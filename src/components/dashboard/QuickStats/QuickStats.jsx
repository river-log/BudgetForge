import "./QuickStats.css";

import { Card } from "../../../ui";

const stats = [
  {
    id: 1,
    label: "Monthly Income",
    value: "$4,000",
    icon: "💰",
  },
  {
    id: 2,
    label: "Monthly Expenses",
    value: "$2,350",
    icon: "💸",
  },
  {
    id: 3,
    label: "Savings",
    value: "$1,150",
    icon: "🎯",
  },
  {
    id: 4,
    label: "Remaining Budget",
    value: "$500",
    icon: "📊",
  },
];

function QuickStats() {
  return (
    <section className="bf-quick-stats">
      {stats.map((stat) => (
        <Card
          key={stat.id}
          className="bf-quick-stats__card"
        >
          <div className="bf-quick-stats__icon">
            {stat.icon}
          </div>

          <div className="bf-quick-stats__content">
            <p className="bf-quick-stats__label">
              {stat.label}
            </p>

            <h3 className="bf-quick-stats__value">
              {stat.value}
            </h3>
          </div>
        </Card>
      ))}
    </section>
  );
}

export default QuickStats;