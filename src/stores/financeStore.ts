import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  subcategory?: string;
  account: string;
  description: string;
  date: string;
  tags: string[];
  recurring?: boolean;
  recurringInterval?: 'weekly' | 'monthly' | 'yearly';
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  currency: string;
  institution?: string;
  isActive: boolean;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'yearly';
  alertThreshold: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category: string;
  isCompleted: boolean;
}

interface FinanceState {
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  goals: Goal[];
  categories: string[];
  
  // Transaction methods
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Account methods
  addAccount: (account: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  
  // Budget methods
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  
  // Goal methods
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  
  // Utility methods
  getTotalBalance: () => number;
  getMonthlyIncome: () => number;
  getMonthlyExpenses: () => number;
  getCategorySpending: () => Record<string, number>;
}

const defaultCategories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Income',
  'Investments',
  'Other'
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      accounts: [],
      budgets: [],
      goals: [],
      categories: defaultCategories,
      
      addTransaction: (transaction) => {
        const newTransaction = { ...transaction, id: Date.now().toString() };
        set((state) => ({
          transactions: [...state.transactions, newTransaction]
        }));
        
        // Update account balance
        const { accounts } = get();
        const account = accounts.find(a => a.id === transaction.account);
        if (account) {
          const balanceChange = transaction.type === 'income' ? transaction.amount : -transaction.amount;
          get().updateAccount(account.id, { balance: account.balance + balanceChange });
        }
      },
      
      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map(t => 
            t.id === id ? { ...t, ...updates } : t
          )
        }));
      },
      
      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter(t => t.id !== id)
        }));
      },
      
      addAccount: (account) => {
        const newAccount = { ...account, id: Date.now().toString() };
        set((state) => ({
          accounts: [...state.accounts, newAccount]
        }));
      },
      
      updateAccount: (id, updates) => {
        set((state) => ({
          accounts: state.accounts.map(a => 
            a.id === id ? { ...a, ...updates } : a
          )
        }));
      },
      
      deleteAccount: (id) => {
        set((state) => ({
          accounts: state.accounts.filter(a => a.id !== id)
        }));
      },
      
      addBudget: (budget) => {
        const newBudget = { ...budget, id: Date.now().toString(), spent: 0 };
        set((state) => ({
          budgets: [...state.budgets, newBudget]
        }));
      },
      
      updateBudget: (id, updates) => {
        set((state) => ({
          budgets: state.budgets.map(b => 
            b.id === id ? { ...b, ...updates } : b
          )
        }));
      },
      
      deleteBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.filter(b => b.id !== id)
        }));
      },
      
      addGoal: (goal) => {
        const newGoal = { ...goal, id: Date.now().toString() };
        set((state) => ({
          goals: [...state.goals, newGoal]
        }));
      },
      
      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map(g => 
            g.id === id ? { ...g, ...updates } : g
          )
        }));
      },
      
      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter(g => g.id !== id)
        }));
      },
      
      getTotalBalance: () => {
        const { accounts } = get();
        return accounts.reduce((total, account) => total + account.balance, 0);
      },
      
      getMonthlyIncome: () => {
        const { transactions } = get();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return transactions
          .filter(t => {
            const tDate = new Date(t.date);
            return t.type === 'income' && 
                   tDate.getMonth() === currentMonth && 
                   tDate.getFullYear() === currentYear;
          })
          .reduce((total, t) => total + t.amount, 0);
      },
      
      getMonthlyExpenses: () => {
        const { transactions } = get();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return transactions
          .filter(t => {
            const tDate = new Date(t.date);
            return t.type === 'expense' && 
                   tDate.getMonth() === currentMonth && 
                   tDate.getFullYear() === currentYear;
          })
          .reduce((total, t) => total + Math.abs(t.amount), 0);
      },
      
      getCategorySpending: () => {
        const { transactions } = get();
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        return transactions
          .filter(t => {
            const tDate = new Date(t.date);
            return t.type === 'expense' && 
                   tDate.getMonth() === currentMonth && 
                   tDate.getFullYear() === currentYear;
          })
          .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
            return acc;
          }, {} as Record<string, number>);
      },
    }),
    {
      name: 'finance-storage',
    }
  )
);
