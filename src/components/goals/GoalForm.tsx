import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinanceStore } from "@/stores/financeStore";
import { toast } from "sonner";
import { Goal } from "@/stores/financeStore";

interface GoalFormProps {
  open: boolean;
  onClose: () => void;
  goal?: Goal;
}

export const GoalForm = ({ open, onClose, goal }: GoalFormProps) => {
  const { addGoal, updateGoal, categories } = useFinanceStore();
  const isEdit = !!goal;
  const [formData, setFormData] = useState({
    name: goal?.name || '',
    targetAmount: goal ? goal.targetAmount.toString() : '',
    currentAmount: goal ? goal.currentAmount.toString() : '',
    deadline: goal?.deadline || '',
    category: goal?.category || ''
  });

  // Update formData when goal changes
  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        deadline: goal.deadline || '',
        category: goal.category
      });
    } else {
      setFormData({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        category: ''
      });
    }
  }, [goal, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const targetAmount = parseFloat(formData.targetAmount);
    const currentAmount = parseFloat(formData.currentAmount) || 0;
    
    if (isNaN(targetAmount) || targetAmount <= 0) {
      toast.error("Please enter a valid target amount");
      return;
    }

    if (currentAmount < 0) {
      toast.error("Current amount cannot be negative");
      return;
    }

    if (isEdit && goal) {
      updateGoal(goal.id, {
        name: formData.name,
        targetAmount: targetAmount,
        currentAmount: currentAmount,
        deadline: formData.deadline || undefined,
        category: formData.category,
        isCompleted: currentAmount >= targetAmount
      });
      toast.success("Goal updated successfully");
    } else {
      addGoal({
        name: formData.name,
        targetAmount: targetAmount,
        currentAmount: currentAmount,
        deadline: formData.deadline || undefined,
        category: formData.category,
        isCompleted: currentAmount >= targetAmount
      });
      toast.success("Goal created successfully");
    }

    // Reset form
    setFormData({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      category: ''
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Emergency Fund"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

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
              <option value="Emergency Fund">Emergency Fund</option>
              <option value="Vacation">Vacation</option>
              <option value="Home Down Payment">Home Down Payment</option>
              <option value="Education">Education</option>
              <option value="Retirement">Retirement</option>
              <option value="Debt Payoff">Debt Payoff</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount *</Label>
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentAmount">Current Amount</Label>
              <Input
                id="currentAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Target Date (Optional)</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Update Goal' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
