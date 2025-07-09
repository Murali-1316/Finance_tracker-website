import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useFinanceStore } from "@/stores/financeStore";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const BudgetOverview = () => {
  const { budgets } = useFinanceStore();

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return { color: 'destructive', icon: AlertTriangle };
    if (percentage >= 80) return { color: 'warning', icon: AlertTriangle };
    return { color: 'success', icon: CheckCircle };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>Monthly budget progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = Math.min((budget.spent / budget.limit) * 100, 100);
            const status = getBudgetStatus(budget.spent, budget.limit);
            const StatusIcon = status.icon;
            
            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {budget.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`h-4 w-4 ${
                      status.color === 'destructive' 
                        ? 'text-red-500' 
                        : status.color === 'warning' 
                        ? 'text-orange-500' 
                        : 'text-green-500'
                    }`} />
                    <span className="text-gray-500 dark:text-gray-400">
                      {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={percentage} 
                  className={`h-2 ${
                    status.color === 'destructive' 
                      ? '[&>div]:bg-red-500' 
                      : status.color === 'warning' 
                      ? '[&>div]:bg-orange-500' 
                      : '[&>div]:bg-green-500'
                  }`}
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{percentage.toFixed(1)}% used</span>
                  <span>{formatCurrency(budget.limit - budget.spent)} remaining</span>
                </div>
              </div>
            );
          })}
          
          {budgets.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No budgets set up yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
