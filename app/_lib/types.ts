// export interface Budget {
//   id: number;
//   name: string;
//   amount: number;
//   emoji?: string;
//   userId: string;
//   transactions: Transaction[];
// }

// export interface Transaction {
//   id: string;
//   description: string;
//   amount: number;
//   emoji?: string;
//   createdAt: Date;
//   budgetId?: string;
// }

export interface Budget {
  id: string;
  createdAt: Date;
  name: string;
  amount: number;
  emoji: string | null;
  transactions?: Transaction[];
}

export interface Transaction {
  id: string;
  amount: number;
  emoji: string | null;
  description: string;
  createdAt: Date;
  budgetName?: string;
  budgetId?: string | null;
}
