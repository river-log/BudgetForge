import { ArrowDownUp, BadgeDollarSign, TrendingDown } from "lucide-react";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function DebtStrategyWidget({ debts, strategy, setStrategy }) {
  const activeDebts = debts.filter((debt) => Number(debt.balance) > 0);
  const ordered = [...activeDebts].sort((left, right) => (
    strategy === "snowball"
      ? Number(left.balance) - Number(right.balance)
      : Number(right.apr) - Number(left.apr) || Number(left.balance) - Number(right.balance)
 ));
  const target = ordered[0];

  return (
    <section className="widget debt-strategy">
      <div className="strategy-heading">
        <div>
          <TrendingDown size={24} aria-hidden="true" />
          <div>
            <h2>Payoff strategy</h2>
            <p>Direct every extra dollar to one debt while paying the minimum on the rest.</p>
          </div>
        </div>
        <div className="strategy-toggle" role="group" aria-label="Debt payoff strategy">
          <button className={strategy === "snowball" ? "selected" : ""} onClick={() => setStrategy("snowball")}>
            Snowball
          </button>
          <button className={strategy === "avalanche" ? "selected" : ""} onClick={() => setStrategy("avalanche")}>
            Avalanche
          </button>
        </div>
      </div>

      <div className="strategy-details">
        <div>
          <h3>{strategy === "snowball" ? "Snowball payoff" : "Avalanche payoff"}</h3>
          <p>
            {strategy === "snowball"
              ? "Pay the smallest balance first to build momentum, then roll its payment into the next debt."
              : "Pay the highest interest rate first to reduce interest costs, then move to the next highest rate."}
          </p>
        </div>
        {target ? (
          <div className="recommended-debt">
            <BadgeDollarSign size={22} aria-hidden="true" />
            <div>
              <span>Recommended to pay next</span>
              <strong>{target.name}</strong>
              <small>{formatCurrency(Number(target.balance))} remaining · {Number(target.apr)}% APR</small>
            </div>
          </div>
        ) : (
          <div className="recommended-debt empty">
            <ArrowDownUp size={22} aria-hidden="true" />
            <div><strong>No active debt</strong><small>Add a debt to get a recommendation.</small></div>
          </div>
        )}
      </div>
    </section>
  );
}

export default DebtStrategyWidget;
