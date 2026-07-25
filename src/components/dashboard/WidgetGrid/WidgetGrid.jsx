import "./WidgetGrid.css";

function WidgetGrid({ children }) {
  return (
    <section className="bf-widget-grid">
      {children}
    </section>
  );
}

export default WidgetGrid;