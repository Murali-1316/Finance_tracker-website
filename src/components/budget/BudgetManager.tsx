import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Plus, AlertTriangle, CheckCircle, TrendingUp, Edit, Trash2 } from "lucide-react";
import { BudgetForm } from "./BudgetForm";
import { useFinanceStore } from "@/stores/financeStore";
import { formatCurrency } from "@/lib/utils";

export const BudgetManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<any | null>(null);
  const { budgets, getMonthlyExpenses, getCategorySpending, deleteBudget, transactions } = useFinanceStore();

  const monthlyExpenses = getMonthlyExpenses();
  const categorySpending = getCategorySpending();
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const totalBudgetSpent = transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return { color: 'destructive', icon: AlertTriangle, text: 'Over Budget' };
    if (percentage >= 80) return { color: 'warning', icon: AlertTriangle, text: 'Near Limit' };
    return { color: 'success', icon: CheckCircle, text: 'On Track' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Budgets</h2>
          <p className="text-gray-600 dark:text-gray-300">Track and manage your spending limits</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Budget</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBudgetLimit)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Spent</p>
                <p className="text-2xl font-bold">{formatCurrency(totalBudgetSpent)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-r ${
          totalBudgetSpent <= totalBudgetLimit 
            ? 'from-green-500 to-green-600' 
            : 'from-red-500 to-red-600'
        } text-white`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm font-medium">Remaining</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(Math.max(0, totalBudgetLimit - totalBudgetSpent))}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((budget) => {
          const actualSpent = categorySpending[budget.category] || 0;
          const percentage = Math.min((actualSpent / budget.limit) * 100, 100);
          const status = getBudgetStatus(actualSpent, budget.limit);
          const StatusIcon = status.icon;
          
          return (
            <Card key={budget.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{budget.category}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`h-5 w-5 ${
                      status.color === 'destructive' 
                        ? 'text-red-500' 
                        : status.color === 'warning' 
                        ? 'text-orange-500' 
                        : 'text-green-500'
                    }`} />
                    <span className={`text-sm font-medium ${
                      status.color === 'destructive' 
                        ? 'text-red-600 dark:text-red-400' 
                        : status.color === 'warning' 
                        ? 'text-orange-600 dark:text-orange-400' 
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {status.text}
                    </span>
                    <Button size="icon" variant="ghost" onClick={() => setEditingBudget(budget)}><Edit className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { if (confirm('Delete this budget?')) deleteBudget(budget.id); }}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                  </div>
                </div>
                <CardDescription>
                  {formatCurrency(actualSpent)} of {formatCurrency(budget.limit)} • {budget.period}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress 
                    value={percentage} 
                    className={`h-3 ${
                      status.color === 'destructive' 
                        ? '[&>div]:bg-red-500' 
                        : status.color === 'warning' 
                        ? '[&>div]:bg-orange-500' 
                        : '[&>div]:bg-green-500'
                    }`}
                  />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {percentage.toFixed(1)}% used
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(Math.max(0, budget.limit - actualSpent))} left
                    </span>
                  </div>
                  
                  {percentage >= budget.alertThreshold && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          You've reached {percentage.toFixed(0)}% of your budget limit
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {budgets.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No budgets created yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Create budgets to track your spending and stay on top of your finances
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Budget
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Budget Form Modal */}
      <BudgetForm open={showForm || !!editingBudget} onClose={() => { setShowForm(false); setEditingBudget(null); }} budget={editingBudget || undefined} />
    </div>
  );
};
