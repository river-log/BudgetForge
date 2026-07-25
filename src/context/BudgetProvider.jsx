import BudgetContext from "./BudgetContext";
import useBudgetData from "../hooks/useBudgetData";

export default function BudgetProvider({
  children,
}) {
  const budget = useBudgetData();

  return (
    <BudgetContext.Provider value={budget}>
      {children}
    </BudgetContext.Provider>
  );
}
