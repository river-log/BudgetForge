import "./RecentActivity.css";

import { Card, EmptyState } from "../../../ui";

const activities = [
  {
    id: 1,
    icon: "💰",
    title: "Income Added",
    description: "Monthly paycheck received.",
    date: "Today",
  },
  {
    id: 2,
    icon: "💳",
    title: "Electric Bill Paid",
    description: "$142 payment completed.",
    date: "Yesterday",
  },
  {
    id: 3,
    icon: "🎯",
    title: "Savings Goal Updated",
    description: "Vacation fund increased.",
    date: "Jul 21",
  },
  {
    id: 4,
    icon: "📝",
    title: "Netflix Bill Created",
    description: "Recurring monthly bill.",
    date: "Jul 20",
  },
];

function RecentActivity() {
  if (activities.length === 0) {
    return (
      <Card className="bf-recent-activity">
        <EmptyState
          title="No recent activity"
          description="Your latest transactions and updates will appear here."
        />
      </Card>
    );
  }

  return (
    <Card className="bf-recent-activity">
      <div className="bf-recent-activity__header">
        <h2 className="bf-recent-activity__title">
          Recent Activity
        </h2>
      </div>

      <ul className="bf-recent-activity__list">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="bf-recent-activity__item"
          >
            <div className="bf-recent-activity__icon">
              {activity.icon}
            </div>

            <div className="bf-recent-activity__content">
              <h3 className="bf-recent-activity__item-title">
                {activity.title}
              </h3>

              <p className="bf-recent-activity__description">
                {activity.description}
              </p>
            </div>

            <span className="bf-recent-activity__date">
              {activity.date}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default RecentActivity;