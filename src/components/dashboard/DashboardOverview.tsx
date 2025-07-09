import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinanceStore } from "@/stores/financeStore";
import { ArrowUpRight, ArrowDownRight, Wallet, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { ExpenseChart } from "./ExpenseChart";
import { IncomeExpenseChart } from "./IncomeExpenseChart";
import { RecentTransactions } from "./RecentTransactions";
import { BudgetOverview } from "./BudgetOverview";
import { formatCurrency } from "@/lib/utils";

export const DashboardOverview = () => {
  const { 
    accounts, 
    transactions,
    goals,
    budgets
  } = useFinanceStore();

  // Calculate total balance from user accounts
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  // Calculate monthly income and expenses from user transactions
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthlyIncome = transactions
    .filter(t => t.type === 'income' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const netIncome = monthlyIncome - monthlyExpenses;
  
  const activeGoals = goals.filter(g => !g.isCompleted);
  const overBudgetCount = budgets.filter(b => b.spent > b.limit).length;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Balance</p>
                <p className="text-3xl font-bold">{formatCurrency(totalBalance)}</p>
              </div>
              <Wallet className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Monthly Income</p>
                <p className="text-3xl font-bold">{formatCurrency(monthlyIncome)}</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Monthly Expenses</p>
                <p className="text-3xl font-bold">{formatCurrency(monthlyExpenses)}</p>
              </div>
              <ArrowDownRight className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-r ${netIncome >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-orange-500 to-orange-600'} text-white`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Net Income</p>
                <p className="text-3xl font-bold">{formatCurrency(netIncome)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {overBudgetCount > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">
                You have {overBudgetCount} budget{overBudgetCount > 1 ? 's' : ''} that are over limit
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Current month spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>Monthly comparison over time</CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTransactions />
        </div>
        <div>
          <BudgetOverview />
        </div>
      </div>
    </div>
  );
};
