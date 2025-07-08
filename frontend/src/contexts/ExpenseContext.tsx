import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import dayjs from 'dayjs';

export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  createdAt: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<boolean>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
  getExpensesByDateRange: (startDate: string, endDate: string) => Expense[];
  getExpensesByCategory: (category: string) => Expense[];
  getTotalExpenses: () => number;
  getMonthlyTotal: (month: number, year: number) => number;
  getExpensesByMonth: () => { month: string; total: number }[];
  getCategoryTotals: () => { category: string; total: number }[];
  isLoading: boolean;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

interface ExpenseProviderProps {
  children: ReactNode;
}

// Mock data for initial expenses
const mockExpenses: Expense[] = [
  {
    id: '1',
    date: dayjs().subtract(2, 'days').format('YYYY-MM-DD'),
    category: 'Food & Dining',
    description: 'Lunch at restaurant',
    amount: 25.50,
    paymentMethod: 'Credit Card',
    createdAt: dayjs().subtract(2, 'days').toISOString(),
  },
  {
    id: '2',
    date: dayjs().subtract(5, 'days').format('YYYY-MM-DD'),
    category: 'Transportation',
    description: 'Gas for car',
    amount: 45.00,
    paymentMethod: 'Debit Card',
    createdAt: dayjs().subtract(5, 'days').toISOString(),
  },
  {
    id: '3',
    date: dayjs().subtract(1, 'week').format('YYYY-MM-DD'),
    category: 'Shopping',
    description: 'Groceries',
    amount: 120.75,
    paymentMethod: 'Credit Card',
    createdAt: dayjs().subtract(1, 'week').toISOString(),
  },
  {
    id: '4',
    date: dayjs().subtract(10, 'days').format('YYYY-MM-DD'),
    category: 'Entertainment',
    description: 'Movie tickets',
    amount: 30.00,
    paymentMethod: 'Cash',
    createdAt: dayjs().subtract(10, 'days').toISOString(),
  },
];

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading expenses from API
    const loadExpenses = async () => {
      try {
        // TODO: Replace with actual API call to /api/expenses
        const savedExpenses = localStorage.getItem('expenses');
        if (savedExpenses) {
          setExpenses(JSON.parse(savedExpenses));
        } else {
          setExpenses(mockExpenses);
          localStorage.setItem('expenses', JSON.stringify(mockExpenses));
        }
      } catch (error) {
        console.error('Error loading expenses:', error);
        setExpenses(mockExpenses);
      } finally {
        setIsLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const addExpense = async (expense: Omit<Expense, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call to POST /api/expenses
      const newExpense: Expense = {
        ...expense,
        id: Date.now().toString(),
        createdAt: dayjs().toISOString(),
      };
      
      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      
      return true;
    } catch (error) {
      console.error('Error adding expense:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateExpense = async (id: string, updatedExpense: Partial<Expense>): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call to PUT /api/expenses/{id}
      const updatedExpenses = expenses.map(expense =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense
      );
      
      setExpenses(updatedExpenses);
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      
      return true;
    } catch (error) {
      console.error('Error updating expense:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpense = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call to DELETE /api/expenses/{id}
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      setExpenses(updatedExpenses);
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      
      return true;
    } catch (error) {
      console.error('Error deleting expense:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getExpensesByDateRange = (startDate: string, endDate: string): Expense[] => {
    return expenses.filter(expense => {
      const expenseDate = dayjs(expense.date);
      return expenseDate.isAfter(dayjs(startDate).subtract(1, 'day')) && 
             expenseDate.isBefore(dayjs(endDate).add(1, 'day'));
    });
  };

  const getExpensesByCategoryFilter = (category: string): Expense[] => {
    return expenses.filter(expense => expense.category === category);
  };

  const getTotalExpenses = (): number => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getMonthlyTotal = (month: number, year: number): number => {
    return expenses
      .filter(expense => {
        const expenseDate = dayjs(expense.date);
        return expenseDate.month() === month && expenseDate.year() === year;
      })
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const getExpensesByMonth = () => {
    const monthlyData: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      const month = dayjs(expense.date).format('MMM YYYY');
      monthlyData[month] = (monthlyData[month] || 0) + expense.amount;
    });

    return Object.entries(monthlyData).map(([month, total]) => ({
      month,
      total,
    }));
  };

  const getCategoryTotals = () => {
    const categoryData: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount;
    });

    return Object.entries(categoryData).map(([category, total]) => ({
      category,
      total,
    }));
  };

  const value: ExpenseContextType = {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpensesByDateRange,
    getExpensesByCategory: getExpensesByCategoryFilter,
    getTotalExpenses,
    getMonthlyTotal,
    getExpensesByMonth,
    getCategoryTotals,
    isLoading,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};