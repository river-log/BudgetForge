import { useContext } from "react";
import BudgetContext from "./BudgetContext";

export default function useBudget() {
  const context = useContext(BudgetContext);

  if (!context) {
    throw new Error(
      "useBudget must be used inside BudgetProvider."
    );
  }

  return context;
}
