import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinanceStore } from "@/stores/financeStore";
import { toast } from "sonner";
import { Budget } from "@/stores/financeStore";

interface BudgetFormProps {
  open: boolean;
  onClose: () => void;
  budget?: Budget;
}

export const BudgetForm = ({ open, onClose, budget }: BudgetFormProps) => {
  const { addBudget, updateBudget, categories } = useFinanceStore();
  const isEdit = !!budget;
  const [formData, setFormData] = useState({
    category: budget?.category || '',
    limit: budget ? budget.limit.toString() : '',
    period: budget?.period || 'monthly',
    alertThreshold: budget ? budget.alertThreshold.toString() : '80'
  });

  // Update formData when budget changes
  useEffect(() => {
    if (budget) {
      setFormData({
        category: budget.category,
        limit: budget.limit.toString(),
        period: budget.period,
        alertThreshold: budget.alertThreshold.toString()
      });
    } else {
      setFormData({
        category: '',
        limit: '',
        period: 'monthly',
        alertThreshold: '80'
      });
    }
  }, [budget, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.limit) {
      toast.error("Please fill in all required fields");
      return;
    }

    const limit = parseFloat(formData.limit);
    const alertThreshold = parseFloat(formData.alertThreshold);
    
    if (isNaN(limit) || limit <= 0) {
      toast.error("Please enter a valid budget limit");
      return;
    }

    if (isNaN(alertThreshold) || alertThreshold < 0 || alertThreshold > 100) {
      toast.error("Please enter a valid alert threshold (0-100)");
      return;
    }

    if (isEdit && budget) {
      updateBudget(budget.id, {
        category: formData.category,
        limit: limit,
        period: formData.period,
        alertThreshold: alertThreshold
      });
      toast.success("Budget updated successfully");
    } else {
      addBudget({
        category: formData.category,
        limit: limit,
        period: formData.period,
        alertThreshold: alertThreshold
      });
      toast.success("Budget created successfully");
    }

    // Reset form
    setFormData({
      category: '',
      limit: '',
      period: 'monthly',
      alertThreshold: '80'
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Budget' : 'Create New Budget'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="limit">Budget Limit *</Label>
              <Input
                id="limit"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.limit}
                onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period">Period *</Label>
              <select
                id="period"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value as 'monthly' | 'yearly' })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="alertThreshold">Alert Threshold (%)</Label>
            <Input
              id="alertThreshold"
              type="number"
              min="0"
              max="100"
              placeholder="80"
              value={formData.alertThreshold}
              onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Get notified when spending reaches this percentage of your budget
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Update Budget' : 'Create Budget'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
