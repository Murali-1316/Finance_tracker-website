import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFinanceStore, Account } from "@/stores/financeStore";
import { toast } from "sonner";

interface AccountFormProps {
  open: boolean;
  onClose: () => void;
  account?: Account;
}

export const AccountForm = ({ open, onClose, account }: AccountFormProps) => {
  const { addAccount, updateAccount } = useFinanceStore();
  const isEdit = !!account;
  const [formData, setFormData] = useState({
    name: account?.name || '',
    type: account?.type || 'checking',
    balance: account ? account.balance.toString() : '',
    currency: account?.currency || 'USD',
    institution: account?.institution || '',
    isActive: account?.isActive ?? true
  });

  // Update formData when account changes
  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        type: account.type,
        balance: account.balance.toString(),
        currency: account.currency,
        institution: account.institution || '',
        isActive: account.isActive
      });
    } else {
      setFormData({
        name: '',
        type: 'checking',
        balance: '',
        currency: 'USD',
        institution: '',
        isActive: true
      });
    }
  }, [account, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.balance) {
      toast.error("Please fill in all required fields");
      return;
    }

    const balance = parseFloat(formData.balance);
    if (isNaN(balance)) {
      toast.error("Please enter a valid balance");
      return;
    }

    if (isEdit && account) {
      updateAccount(account.id, {
        name: formData.name,
        type: formData.type,
        balance: balance,
        currency: formData.currency,
        institution: formData.institution,
        isActive: formData.isActive
      });
      toast.success("Account updated successfully");
    } else {
      addAccount({
        name: formData.name,
        type: formData.type,
        balance: balance,
        currency: formData.currency,
        institution: formData.institution,
        isActive: formData.isActive
      });
      toast.success("Account added successfully");
    }

    onClose();
    
    // Reset form
    setFormData({
      name: '',
      type: 'checking',
      balance: '',
      currency: 'USD',
      institution: '',
      isActive: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Account' : 'Add New Account'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Account Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Main Checking"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Account Type *</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="checking">Checking</option>
              <option value="savings">Savings</option>
              <option value="credit">Credit Card</option>
              <option value="investment">Investment</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Current Balance *</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency *</Label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="USD">USD - US Dollar</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="institution">Bank/Institution</Label>
            <Input
              id="institution"
              placeholder="e.g., Chase Bank"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded"
            />
            <Label htmlFor="isActive">Active account</Label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Update Account' : 'Add Account'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
