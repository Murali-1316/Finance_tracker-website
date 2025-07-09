import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, PiggyBank, Landmark, TrendingUp, Wallet } from "lucide-react";
import { AccountForm } from "./AccountForm";
import { AccountCard } from "./AccountCard";
import { useFinanceStore, Account } from "@/stores/financeStore";
import { AccountViewModal } from "./AccountViewModal";
import { formatCurrency } from "@/lib/utils";

export const AccountManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [viewingAccount, setViewingAccount] = useState<Account | null>(null);
  const { accounts, getTotalBalance } = useFinanceStore();

  const totalBalance = getTotalBalance();
  
  const accountsByType = {
    checking: accounts.filter(a => a.type === 'checking'),
    savings: accounts.filter(a => a.type === 'savings'),
    credit: accounts.filter(a => a.type === 'credit'),
    investment: accounts.filter(a => a.type === 'investment'),
    cash: accounts.filter(a => a.type === 'cash'),
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checking': return CreditCard;
      case 'savings': return PiggyBank;
      case 'credit': return CreditCard;
      case 'investment': return TrendingUp;
      case 'cash': return Wallet;
      default: return Landmark;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Accounts</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage your financial accounts</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      {/* Total Balance */}
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-blue-100 text-lg font-medium mb-2">Total Net Worth</p>
            <p className="text-5xl font-bold">{formatCurrency(totalBalance)}</p>
            <p className="text-blue-100 mt-2">Across {accounts.length} accounts</p>
          </div>
        </CardContent>
      </Card>

      {/* Account Types */}
      <div className="space-y-6">
        {Object.entries(accountsByType).map(([type, typeAccounts]) => {
          if (typeAccounts.length === 0) return null;
          
          const Icon = getTypeIcon(type);
          const typeBalance = typeAccounts.reduce((sum, acc) => sum + acc.balance, 0);
          
          return (
            <div key={type}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                      {type} Accounts
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {typeAccounts.length} account{typeAccounts.length > 1 ? 's' : ''} • {formatCurrency(typeBalance)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {typeAccounts.map((account) => (
                  <AccountCard key={account.id} account={account} onEdit={() => { setEditingAccount(account); setShowForm(true); }} onView={() => setViewingAccount(account)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {accounts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Landmark className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No accounts added yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start by adding your bank accounts, credit cards, and other financial accounts
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Account
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Account Form Modal */}
      <AccountForm open={showForm} onClose={() => { setShowForm(false); setEditingAccount(null); }} account={editingAccount || undefined} />
      {/* Account View Modal */}
      <AccountViewModal open={!!viewingAccount} account={viewingAccount || undefined} onClose={() => setViewingAccount(null)} />
    </div>
  );
};
