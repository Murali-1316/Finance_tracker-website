
import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  subcategory?: string;
  account_id: string;
  description: string;
  date: string;
  tags: string[];
  recurring?: boolean;
  recurring_interval?: 'weekly' | 'monthly' | 'yearly';
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  currency: string;
  institution?: string;
  is_active: boolean;
}

export interface Budget {
  id: string;
  category: string;
  limit_amount: number;
  spent: number;
  period: 'monthly' | 'yearly';
  alert_threshold: number;
}

export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  category: string;
  is_completed: boolean;
}

interface SupabaseFinanceState {
  transactions: Transaction[];
  accounts: Account[];
  budgets: Budget[];
  goals: Goal[];
  categories: string[];
  isLoading: boolean;
  
  // Fetch methods
  fetchTransactions: () => Promise<void>;
  fetchAccounts: () => Promise<void>;
  fetchBudgets: () => Promise<void>;
  fetchGoals: () => Promise<void>;
  
  // Transaction methods
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  
  // Account methods
  addAccount: (account: Omit<Account, 'id'>) => Promise<void>;
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  
  // Budget methods
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  
  // Goal methods
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  
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

export const useSupabaseFinanceStore = create<SupabaseFinanceState>()((set, get) => ({
  transactions: [],
  accounts: [],
  budgets: [],
  goals: [],
  categories: defaultCategories,
  isLoading: false,
  
  fetchTransactions: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        amount,
        type,
        category,
        subcategory,
        account_id,
        description,
        date,
        tags,
        recurring,
        recurring_interval
      `)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      set({ transactions: data || [] });
    }
    set({ isLoading: false });
  },
  
  fetchAccounts: async () => {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching accounts:', error);
    } else {
      set({ accounts: data || [] });
    }
  },
  
  fetchBudgets: async () => {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching budgets:', error);
    } else {
      set({ budgets: data || [] });
    }
  },
  
  fetchGoals: async () => {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching goals:', error);
    } else {
      set({ goals: data || [] });
    }
  },
  
  addTransaction: async (transaction) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        ...transaction,
        user_id: user.user.id,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding transaction:', error);
    } else {
      set(state => ({
        transactions: [data, ...state.transactions]
      }));
      
      // Update account balance
      const account = get().accounts.find(a => a.id === transaction.account_id);
      if (account) {
        const balanceChange = transaction.type === 'income' ? transaction.amount : -transaction.amount;
        await get().updateAccount(account.id, { balance: account.balance + balanceChange });
      }
    }
  },
  
  updateTransaction: async (id, updates) => {
    const { error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating transaction:', error);
    } else {
      set(state => ({
        transactions: state.transactions.map(t => 
          t.id === id ? { ...t, ...updates } : t
        )
      }));
    }
  },
  
  deleteTransaction: async (id) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting transaction:', error);
    } else {
      set(state => ({
        transactions: state.transactions.filter(t => t.id !== id)
      }));
    }
  },
  
  addAccount: async (account) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    
    const { data, error } = await supabase
      .from('accounts')
      .insert([{
        ...account,
        user_id: user.user.id,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding account:', error);
    } else {
      set(state => ({
        accounts: [...state.accounts, data]
      }));
    }
  },
  
  updateAccount: async (id, updates) => {
    const { error } = await supabase
      .from('accounts')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating account:', error);
    } else {
      set(state => ({
        accounts: state.accounts.map(a => 
          a.id === id ? { ...a, ...updates } : a
        )
      }));
    }
  },
  
  deleteAccount: async (id) => {
    const { error } = await supabase
      .from('accounts')
      .update({ is_active: false })
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting account:', error);
    } else {
      set(state => ({
        accounts: state.accounts.filter(a => a.id !== id)
      }));
    }
  },
  
  addBudget: async (budget) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    
    const { data, error } = await supabase
      .from('budgets')
      .insert([{
        ...budget,
        user_id: user.user.id,
        spent: 0,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding budget:', error);
    } else {
      set(state => ({
        budgets: [...state.budgets, data]
      }));
    }
  },
  
  updateBudget: async (id, updates) => {
    const { error } = await supabase
      .from('budgets')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating budget:', error);
    } else {
      set(state => ({
        budgets: state.budgets.map(b => 
          b.id === id ? { ...b, ...updates } : b
        )
      }));
    }
  },
  
  deleteBudget: async (id) => {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting budget:', error);
    } else {
      set(state => ({
        budgets: state.budgets.filter(b => b.id !== id)
      }));
    }
  },
  
  addGoal: async (goal) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    
    const { data, error } = await supabase
      .from('goals')
      .insert([{
        ...goal,
        user_id: user.user.id,
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding goal:', error);
    } else {
      set(state => ({
        goals: [...state.goals, data]
      }));
    }
  },
  
  updateGoal: async (id, updates) => {
    const { error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating goal:', error);
    } else {
      set(state => ({
        goals: state.goals.map(g => 
          g.id === id ? { ...g, ...updates } : g
        )
      }));
    }
  },
  
  deleteGoal: async (id) => {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting goal:', error);
    } else {
      set(state => ({
        goals: state.goals.filter(g => g.id !== id)
      }));
    }
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
}));
