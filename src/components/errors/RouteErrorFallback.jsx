import "./AppErrorBoundary.css";
import { Logo } from "../branding";

function RouteErrorFallback({ onReload, onRetry }) {
  return (
    <main className="app-error-fallback" role="alert">
      <section className="app-error-fallback__card">
        <Logo variant="mark" theme="dark" size="lg" decorative />
        <span className="app-error-fallback__eyebrow">BudgetForge</span>
        <h1>Something went wrong</h1>
        <p>
          We couldn't load this part of BudgetForge. Your saved data is still
          safe.
        </p>
        <div className="app-error-fallback__actions">
          <button onClick={onRetry} type="button">Try again</button>
          <button className="secondary-button" onClick={onReload} type="button">
            Reload application
          </button>
        </div>
      </section>
    </main>
  );
}

export default RouteErrorFallback;
