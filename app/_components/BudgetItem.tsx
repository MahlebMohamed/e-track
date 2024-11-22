import { Budget } from "../_lib/types";

interface BudgetItemProps {
  budget: Budget;
  enableHover?: number;
}

export default function BudgetItem({ budget, enableHover }: BudgetItemProps) {
  const transactionCount = budget.transactions ? budget.transactions.length : 0;
  const totalTransactionAmount = budget.transactions
    ? budget.transactions.reduce(
        (totalAmount, transaction) => totalAmount + transaction.amount,
        0,
      )
    : 0;
  const remainingAmount = budget.amount - totalTransactionAmount;
  const progressValue =
    totalTransactionAmount > budget.amount
      ? 100
      : (totalTransactionAmount / budget.amount) * 100;
  const hoverClasse =
    enableHover === 1 ? "hover:shadow-xl hover:border-accent" : "";

  return (
    <li
      key={budget.id}
      className={`m-4 list-none rounded-xl border-2 border-base-300 p-4 ${hoverClasse}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 text-xl">
            {budget.emoji}
          </div>
          <div className="ml-3 flex flex-col">
            <span className="text-xl font-bold">{budget.name}</span>
            <span className="text-sm text-gray-500">
              {transactionCount} transaction(s)
            </span>
          </div>
        </div>
        <div className="text-xl font-bold text-accent">{budget.amount} €</div>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>{totalTransactionAmount} € dépensés</span>
        <span>{remainingAmount} € restants</span>
      </div>

      <div>
        <progress
          className="progress progress-accent mt-4 w-full"
          value={progressValue}
          max="100"
        ></progress>
      </div>
    </li>
  );
}
