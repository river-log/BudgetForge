import "./UpcomingBills.css";

import {
  Badge,
  Button,
  Card,
  EmptyState,
} from "../../../ui";

const bills = [
  {
    id: 1,
    name: "Internet",
    dueDate: "Jul 28",
    amount: 85.0,
    status: "Due Soon",
    variant: "warning",
  },
  {
    id: 2,
    name: "Electric",
    dueDate: "Jul 30",
    amount: 142.0,
    status: "Upcoming",
    variant: "info",
  },
  {
    id: 3,
    name: "Car Insurance",
    dueDate: "Aug 01",
    amount: 176.0,
    status: "Upcoming",
    variant: "primary",
  },
  {
    id: 4,
    name: "Netflix",
    dueDate: "Aug 02",
    amount: 17.99,
    status: "Upcoming",
    variant: "primary",
  },
];

function UpcomingBills({ onViewAll }) {
  if (bills.length === 0) {
    return (
      <Card className="bf-upcoming-bills">
        <EmptyState
          title="No upcoming bills"
          description="You're all caught up!"
        />
      </Card>
    );
  }

  return (
    <Card className="bf-upcoming-bills">
      <div className="bf-upcoming-bills__header">
        <h2 className="bf-upcoming-bills__title">
          Upcoming Bills
        </h2>

        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
        >
          View All
        </Button>
      </div>

      <ul className="bf-upcoming-bills__list">
        {bills.map((bill) => (
          <li
            key={bill.id}
            className="bf-upcoming-bills__item"
          >
            <div className="bf-upcoming-bills__info">
              <h3 className="bf-upcoming-bills__name">
                {bill.name}
              </h3>

              <p className="bf-upcoming-bills__date">
                Due {bill.dueDate}
              </p>
            </div>

            <div className="bf-upcoming-bills__details">
              <Badge variant={bill.variant}>
                {bill.status}
              </Badge>

              <span className="bf-upcoming-bills__amount">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(bill.amount)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default UpcomingBills;