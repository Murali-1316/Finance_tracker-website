import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Account, useFinanceStore } from "@/stores/financeStore";
import { CreditCard, PiggyBank, TrendingUp, Wallet, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

interface AccountCardProps {
  account: Account;
  onEdit?: () => void;
  onView?: () => void;
}

export const AccountCard = ({ account, onEdit, onView }: AccountCardProps) => {
  const { updateAccount, deleteAccount } = useFinanceStore();

  const getIcon = () => {
    switch (account.type) {
      case 'checking': return CreditCard;
      case 'savings': return PiggyBank;
      case 'credit': return CreditCard;
      case 'investment': return TrendingUp;
      case 'cash': return Wallet;
      default: return CreditCard;
    }
  };

  const getColorScheme = () => {
    switch (account.type) {
      case 'checking': return 'from-blue-500 to-blue-600';
      case 'savings': return 'from-green-500 to-green-600';
      case 'credit': return 'from-red-500 to-red-600';
      case 'investment': return 'from-purple-500 to-purple-600';
      case 'cash': return 'from-gray-500 to-gray-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const handleToggleActive = () => {
    updateAccount(account.id, { isActive: !account.isActive });
    toast.success(`Account ${account.isActive ? 'deactivated' : 'activated'}`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this account?')) {
      deleteAccount(account.id);
      toast.success('Account deleted successfully');
    }
  };

  const Icon = getIcon();

  return (
    <Card className={`relative overflow-hidden ${!account.isActive ? 'opacity-60' : ''}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${getColorScheme()} opacity-5 pointer-events-none`} />
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${getColorScheme()}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {account.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {account.type}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onView}
              className="text-gray-500 hover:text-gray-700"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Balance</p>
            <p className={`text-2xl font-bold ${
              account.balance >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(account.balance, account.currency)}
            </p>
          </div>

          {account.institution && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Institution</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {account.institution}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
            <Badge variant={account.isActive ? "default" : "secondary"}>
              {account.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
