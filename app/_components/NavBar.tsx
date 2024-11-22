"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { checkAndAddUser } from "../_lib/actions";

export default function NavBar() {
  const { isSignedIn, isLoaded, user } = useUser();

  useEffect(
    function () {
      if (user?.primaryEmailAddress?.emailAddress)
        checkAndAddUser(user?.primaryEmailAddress?.emailAddress);
    },
    [user],
  );

  return (
    <nav className="bg-base-300/30 px-5 py-4 md:px-[10%] md:py-6">
      {isLoaded &&
        (isSignedIn ? (
          <>
            <div className="flex items-center justify-between">
              <Link href={"/"}>
                <h1 className="text-2xl font-bold">
                  e <span className="text-accent">track</span>
                </h1>
              </Link>

              <div className="hidden items-center justify-center gap-8 md:flex">
                <Link className="btn" href={"/budjets"}>
                  Mes Budjets
                </Link>
                <Link className="btn" href={""}>
                  Tableau de bord
                </Link>
                <Link className="btn" href={""}>
                  Mes Transaction
                </Link>
              </div>

              <UserButton />
            </div>

            <div className="mt-2 flex items-center justify-center gap-8 md:hidden">
              <Link className="btn btn-sm" href={""}>
                Mes Budjets
              </Link>
              <Link className="btn btn-sm" href={""}>
                Tableau de bord
              </Link>
              <Link className="btn btn-sm" href={""}>
                Mes Transaction
              </Link>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center text-2xl font-bold">
              e <span className="text-accent">.Track</span>
            </div>
            <div className="mt-2 flex justify-center">
              <Link href={"/sign-in"} className="btn btn-sm">
                Se connecter
              </Link>
              <Link href={"/sign-up"} className="btn btn-accent btn-sm mx-4">
                S&apos;inscrire
              </Link>
            </div>
          </div>
        ))}
    </nav>
  );
}
