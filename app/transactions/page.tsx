"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Wrapper from "../_components/Wrapper";
import { getTransactionsByEmailAndPeriod } from "../_lib/actions";
import { Transaction } from "../_lib/types";

export default function Page() {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function fetchTransactions(period: string) {
    if (user?.primaryEmailAddress?.emailAddress) {
      setLoading(true);
      try {
        const transactionData = await getTransactionsByEmailAndPeriod(
          user?.primaryEmailAddress.emailAddress,
          period,
        );
        setTransactions(transactionData);
        setLoading(false);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des transactions:",
          error,
        );
      }
    }
  }

  useEffect(
    function () {
      fetchTransactions("last7");
    },
    [user?.primaryEmailAddress?.emailAddress],
  );

  return (
    <Wrapper>
      <div className="w-full overflow-x-auto rounded-xl bg-base-200/50 p-5">
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="loading loading-spinner loading-md"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div></div>
        ) : (
          <div></div>
        )}
      </div>
    </Wrapper>
  );
}
