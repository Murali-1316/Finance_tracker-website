import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, CheckCircle, Clock, TrendingUp, Edit, Trash2 } from "lucide-react";
import { GoalForm } from "./GoalForm";
import { useFinanceStore } from "@/stores/financeStore";
import { formatCurrency } from "@/lib/utils";

export const GoalsTracker = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const { goals, deleteGoal } = useFinanceStore();

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);
  const totalTargetAmount = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getGoalStatus = (goal: any) => {
    if (goal.isCompleted) return { color: 'success', text: 'Completed', icon: CheckCircle };
    
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    if (percentage >= 90) return { color: 'near-complete', text: 'Almost There!', icon: TrendingUp };
    if (percentage >= 50) return { color: 'progress', text: 'On Track', icon: TrendingUp };
    return { color: 'starting', text: 'Getting Started', icon: Target };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Goals</h2>
          <p className="text-gray-600 dark:text-gray-300">Track your progress towards financial milestones</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Goal
        </Button>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-blue-100 text-sm font-medium">Total Goals</p>
              <p className="text-3xl font-bold">{goals.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-green-100 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold">{completedGoals.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-purple-100 text-sm font-medium">Target Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(totalTargetAmount)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-orange-100 text-sm font-medium">Saved So Far</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCurrentAmount)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGoals.map((goal) => {
              const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              const status = getGoalStatus(goal);
              const StatusIcon = status.icon;
              const remaining = goal.targetAmount - goal.currentAmount;
              
              return (
                <Card key={goal.id} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1 ${
                    status.color === 'success' ? 'bg-green-500' :
                    status.color === 'near-complete' ? 'bg-blue-500' :
                    status.color === 'progress' ? 'bg-purple-500' : 'bg-gray-300'
                  }`} />
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        <CardDescription>{goal.category}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`h-5 w-5 ${
                          status.color === 'success' ? 'text-green-500' :
                          status.color === 'near-complete' ? 'text-blue-500' :
                          status.color === 'progress' ? 'text-purple-500' : 'text-gray-500'
                        }`} />
                        <Badge variant="secondary" className="text-xs">
                          {status.text}
                        </Badge>
                        <Button size="icon" variant="ghost" onClick={() => setEditingGoal(goal)}><Edit className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={() => { if (confirm('Delete this goal?')) deleteGoal(goal.id); }}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={percentage} className="h-3" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Current</p>
                        <p className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(goal.currentAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Target</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(goal.targetAmount)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {remaining > 0 ? `${formatCurrency(remaining)} remaining` : 'Goal achieved!'}
                        </span>
                        {goal.deadline && (
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(goal.deadline)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Completed Goals</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{goal.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{goal.category}</p>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(goal.targetAmount)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No financial goals yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Set financial goals to stay motivated and track your progress
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Goal Form Modal */}
      <GoalForm open={showForm || !!editingGoal} onClose={() => { setShowForm(false); setEditingGoal(null); }} goal={editingGoal || undefined} />
    </div>
  );
};
