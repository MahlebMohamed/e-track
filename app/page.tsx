"use client";

import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import BudgetItem from "./_components/BudgetItem";
import budgets from "./_lib/data";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <div>
      <header className="flex w-full flex-col items-center justify-center py-10">
        <div className="flex flex-col">
          <h1 className="text-center text-4xl font-bold md:text-5xl md:leading-[3.3rem]">
            Prenez le contrôle <br /> de vos finances
          </h1>
          <p className="py-4 text-center text-gray-800">
            Suivez vos budgets et vos dépenses <br /> en toute simplicité avec
            notre application intuitive !
          </p>
          {isLoaded && !isSignedIn && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Link
                href={"/sign-in"}
                className="btn btn-outline btn-accent btn-sm md:btn-md"
              >
                Se connecter
              </Link>
              <Link
                href={"/sign-up"}
                className="btn btn-accent btn-sm md:btn-md"
              >
                S&apos;inscrire
              </Link>
            </div>
          )}
        </div>

        <ul className="grid md:grid-cols-3">
          {budgets.map((budget) => (
            <Link href={""} key={budget.id}>
              <BudgetItem budget={budget} enableHover={1} />
            </Link>
          ))}
        </ul>
      </header>
    </div>
  );
}
