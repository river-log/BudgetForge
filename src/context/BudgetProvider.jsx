import BudgetContext from "./BudgetContext";
import useBudgetData from "../hooks/useBudgetData";

export default function BudgetProvider({
  children,
  showToast,
}) {
  const budget = useBudgetData(showToast);

  return (
    <BudgetContext.Provider value={budget}>
      {children}
    </BudgetContext.Provider>
  );
}
