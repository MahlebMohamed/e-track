"use server";

import prisma from "./prisma";

export async function checkAndAddUser(email: string | undefined) {
  if (!email) return;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!existingUser) {
      await prisma.user.create({
        data: { email },
      });
      console.log("Nouvele utilisateur ajouter a la base de données");
    } else {
      console.log("Utilisateur déjà présent dans la base de données");
    }
  } catch (error) {
    console.log("Erreur lors de la vérification de la base de donnee", error);
  }
}

export async function addBudget(
  email: string,
  name: string,
  amount: number,
  emoji: string,
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new Error("Utilisateur introuvable");

    await prisma.budget.create({
      data: {
        name,
        amount,
        emoji,
        userId: user.id,
      },
    });
  } catch (error) {
    console.log("Erreur lors de la creation de le user", error);
  }
}

export async function getBudgetsByUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        budget: {
          include: {
            transactions: true,
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    return user.budget;
  } catch (error) {
    console.log("Erreur lors de la récupération des budgets", error);
    throw new Error("Erreur lors de la récupération des budgets");
  }
}

export async function getTransactionsByBudgetId(budgetId: string) {
  try {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: {
        transactions: true,
      },
    });
    if (!budget) throw new Error("Budget not found");
    return budget;
  } catch (error) {
    console.log("Erreur lors de la récupération des transactions", error);
  }
}

export async function addTransactionToBudget(
  budgetId: string,
  amount: number,
  description: string,
) {
  try {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
      include: {
        transactions: true,
      },
    });
    if (!budget) throw new Error("Budget not found");

    const totalTransations = budget.transactions.reduce(
      (total, transaction) => total + transaction.amount,
      0,
    );

    if (totalTransations + amount > budget.amount) {
      throw new Error("Amount is greater than the budget");
    }

    await prisma.transaction.create({
      data: {
        description,
        amount,
        emoji: budget.emoji,
        budgetId: budget.id,
      },
    });
  } catch (error) {
    console.log("Erreur lors de la création de la transaction", error);
  }
}

export async function deleteBudget(budgetId: string) {
  try {
    const budget = await prisma.budget.findUnique({
      where: { id: budgetId },
    });
    if (!budget) throw new Error("Budget not found");

    await prisma.transaction.deleteMany({
      where: { budgetId },
    });

    await prisma.budget.delete({
      where: { id: budgetId },
    });
  } catch (error) {
    console.log("Erreur lors de la suppression du budget", error);
  }
}

export async function deleteTransaction(transactionId: string) {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });
    if (!transaction) throw new Error("Transaction not found");

    await prisma.transaction.delete({
      where: { id: transactionId },
    });
  } catch (error) {
    console.log("Erreur lors de la suppression de la transaction", error);
  }
}

export async function getTransactionsByEmailAndPeriod(
  email: string,
  period: string,
) {
  const now = new Date();
  let dataLimit;

  try {
    switch (period) {
      case "last7":
        dataLimit = new Date(now);
        dataLimit.setDate(now.getDate() - 7);
        break;
      case "last30":
        dataLimit = new Date(now);
        dataLimit.setDate(now.getDate() - 30);
        break;

      case "last90":
        dataLimit = new Date(now);
        dataLimit.setDate(now.getDate() - 90);
        break;

      case "last365":
        dataLimit = new Date(now);
        dataLimit.setDate(now.getDate() - 365);
        break;

      default:
        throw new Error("Period not found");
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        budget: {
          include: {
            transactions: {
              where: {
                createdAt: {
                  gte: dataLimit,
                },
              },
              orderBy: {
                createdAt: "desc",
              },
            },
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    const transactions = await user.budget.flatMap((budget) => {
      budget.transactions.map((transaction) => ({
        ...transaction,
        budgetName: budget.name,
      }));
    });

    return transactions;
  } catch (error) {
    console.log(error);
  }
}
