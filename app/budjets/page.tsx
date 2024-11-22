"use client";

import { useUser } from "@clerk/nextjs";
import EmojiPicker from "emoji-picker-react";
import { useCallback, useEffect, useState } from "react";
import Notification from "../_components/Notification";
import Wrapper from "../_components/Wrapper";
import { addBudget, getBudgetsByUser } from "../_lib/actions";
import { Budget } from "../_lib/types";
import Link from "next/link";
import BudgetItem from "../_components/BudgetItem";
import { Landmark } from "lucide-react";

function Page() {
  const { user } = useUser();
  const [budgetName, setBudgetName] = useState<string>("");
  const [budgetAmout, setBudgetAmout] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [selectEmoji, setSelectEmoji] = useState<string>("");
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const [notification, setNotification] = useState<string>("");
  function closeNotification() {
    setNotification("");
  }

  function handleEmojiSelection(emojiObject: { emoji: string }) {
    setSelectEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
  }

  async function handleAddBudget() {
    try {
      const amount = parseFloat(budgetAmout);
      if (!isNaN(amount) && amount < 0)
        throw new Error("le montant doit être positif");

      if (budgetName === "" || !budgetAmout) return;

      await addBudget(
        user?.primaryEmailAddress?.emailAddress as string,
        budgetName,
        amount,
        selectEmoji,
      );

      await fetchBudgets();

      (document.getElementById("my_modal_3") as HTMLDialogElement).close();

      setNotification("Nouveau budget ajouté");

      setBudgetAmout("");
      setBudgetName("");
      setSelectEmoji("");
      setShowEmojiPicker(false);
    } catch (error) {
      throw new Error("Erreur lors de l'ajout du budget", { cause: error });
    }
  }

  const fetchBudgets = useCallback(async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      try {
        const budjets = await getBudgetsByUser(
          user?.primaryEmailAddress?.emailAddress,
        );
        setBudgets(budjets);
      } catch (error) {
        setNotification(`Erreur lors de la récupération des budgets: ${error}`);
      }
    }
  }, [user]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  return (
    <Wrapper>
      {notification && (
        <Notification message={notification} onclose={closeNotification} />
      )}

      <button
        className="btn mb-4"
        onClick={() =>
          (
            document.getElementById("my_modal_3") as HTMLDialogElement
          ).showModal()
        }
      >
        Nouveau Budget
        <Landmark className="w-4" />
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="text-lg font-bold">Creation d&apos;un budget</h3>
          <p className="py-4">Permet de controler ces deponses facilement</p>
          <div className="flex w-full flex-col">
            <input
              type="text"
              value={budgetName}
              onChange={(e) => setBudgetName(e.target.value)}
              placeholder="Nom du budget"
              className="input input-bordered mb-3"
            />
            <input
              type="number"
              value={budgetAmout}
              onChange={(e) => setBudgetAmout(e.target.value)}
              placeholder="Montant "
              className="input input-bordered mb-3"
            />

            <button
              className="btn mb-3"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {selectEmoji || "sélectionnez un emoji"}
            </button>

            {showEmojiPicker && (
              <EmojiPicker
                className="mx-auto mb-3"
                onEmojiClick={handleEmojiSelection}
              />
            )}

            <button className="btn" onClick={handleAddBudget}>
              Ajouter Budget
            </button>
          </div>
        </div>
      </dialog>

      <ul className="grid md:grid-cols-3">
        {budgets.map((budget) => (
          <Link href={`/manage/${budget.id}`} key={budget.id}>
            <BudgetItem budget={budget} enableHover={1} />
          </Link>
        ))}
      </ul>
    </Wrapper>
  );
}

export default Page;
