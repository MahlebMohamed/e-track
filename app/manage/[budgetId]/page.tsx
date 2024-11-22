"use client";

import BudgetItem from "@/app/_components/BudgetItem";
import Notification from "@/app/_components/Notification";
import Wrapper from "@/app/_components/Wrapper";
import {
  addTransactionToBudget,
  deleteBudget,
  deleteTransaction,
  getTransactionsByBudgetId,
} from "@/app/_lib/actions";
import { Budget } from "@/app/_lib/types";
import { Send, Trash } from "lucide-react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ budgetId: string }>;
}) {
  const [budget, setBudget] = useState<Budget | undefined>();
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [notification, setNotification] = useState<string>("");
  const closeNotification = () => {
    setNotification("");
  };

  async function fetchBudgetData(budgetId: string) {
    try {
      if (budgetId) {
        const budgetData = await getTransactionsByBudgetId(budgetId);
        setBudget(budgetData);
      }
    } catch (error) {
      console.error("Failed to fetch budget data:", error);
    }
  }

  async function handleAddTransaction() {
    if (!amount || !description) {
      setNotification("Veuillez remplir tous les champs");
      return;
    }

    try {
      const amountNumber = parseFloat(amount);
      if (isNaN(amountNumber) || amountNumber <= 0) {
        setNotification("Veuillez entrer un montant valide");
        return;
      }
      const resolvedParams = await params;
      await addTransactionToBudget(
        resolvedParams.budgetId,
        amountNumber,
        description,
      );

      fetchBudgetData(resolvedParams.budgetId);

      setNotification("Transaction ajoutée avec succès");
      setDescription("");
      setAmount("");
    } catch (error) {
      console.log("Failed to add transaction", error);
    }
  }

  const handleDeleteBudget = async () => {
    const comfirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce budget et toutes ses transactions associées ?",
    );
    if (comfirmed) {
      try {
        const resolvedParams = await params;
        await deleteBudget(resolvedParams.budgetId);
      } catch (error) {
        console.error("Erreur lors de la suppression du budget:", error);
      }
      redirect("/budjets");
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    const comfirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette transaction ?",
    );
    if (comfirmed) {
      try {
        await deleteTransaction(transactionId);
        const resolvedParams = await params;
        fetchBudgetData(resolvedParams.budgetId);
        setNotification("Dépense supprimée");
      } catch (error) {
        console.error("Erreur lors de la suppression du budget:", error);
      }
    }
  };

  useEffect(() => {
    const getId = async () => {
      const resolvedParams = await params;
      fetchBudgetData(resolvedParams.budgetId);
    };
    getId();
  }, [params]);

  console.log(budget?.transactions);

  return (
    <Wrapper>
      {notification && (
        <Notification
          message={notification}
          onclose={closeNotification}
        ></Notification>
      )}
      {budget && (
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <BudgetItem budget={budget} enableHover={0} />
            <button onClick={() => handleDeleteBudget()} className="btn mt-4">
              supprimer le budget
            </button>
            <div className="mt-4 flex flex-col space-y-4">
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
                className="input input-bordered"
              />

              <input
                type="number"
                id="amount"
                placeholder="Montant"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="input input-bordered"
              />

              <button onClick={handleAddTransaction} className="btn">
                Ajouter votre dépense
              </button>
            </div>
          </div>

          {budget?.transactions && budget.transactions.length > 0 ? (
            <div className="ml-4 mt-4 overflow-x-auto md:mt-0 md:w-2/3">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th></th>
                    <th>Amount</th>
                    <th>description</th>
                    <th>emoji</th>
                  </tr>
                </thead>
                <tbody>
                  {budget?.transactions.map((transaction, index) => (
                    <tr key={transaction.id}>
                      <th>{index + 1}</th>
                      <td>- {transaction.amount}€</td>
                      <td>{transaction.description}</td>
                      <td>{transaction.emoji}</td>
                      <td>
                        <button
                          onClick={() =>
                            handleDeleteTransaction(transaction.id)
                          }
                          className="btn btn-sm"
                        >
                          <Trash className="w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mx-auto mt-10 flex w-2/3 items-center justify-center gap-3 md:ml-4">
              <Send strokeWidth={1.5} className="h-8 w-8 text-accent" />
              <span className="font-bold text-gray-500">
                Aucune transaction
              </span>
            </div>
          )}
        </div>
      )}
    </Wrapper>
  );
}
