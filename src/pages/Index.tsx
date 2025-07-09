
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { TransactionManager } from "@/components/transactions/TransactionManager";
import { AccountManager } from "@/components/accounts/AccountManager";
import { BudgetManager } from "@/components/budget/BudgetManager";
import { GoalsTracker } from "@/components/goals/GoalsTracker";
import { ReportsView } from "@/components/reports/ReportsView";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { Navigation } from "@/components/layout/Navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseFinanceStore } from "@/stores/supabaseFinanceStore";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, signOut, isLoading } = useAuth();
  const { fetchAccounts, fetchTransactions, fetchBudgets, fetchGoals } = useSupabaseFinanceStore();

  useEffect(() => {
    if (user) {
      // Fetch all data when user is authenticated
      fetchAccounts();
      fetchTransactions();
      fetchBudgets();
      fetchGoals();
    }
  }, [user, fetchAccounts, fetchTransactions, fetchBudgets, fetchGoals]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 ml-64">
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Welcome back, {user?.user_metadata?.full_name || user?.email || 'User'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Here's your financial overview for today
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="text-sm"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </header>

          <main className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="dashboard">
                <DashboardOverview />
              </TabsContent>
              <TabsContent value="transactions">
                <TransactionManager />
              </TabsContent>
              <TabsContent value="accounts">
                <AccountManager />
              </TabsContent>
              <TabsContent value="budgets">
                <BudgetManager />
              </TabsContent>
              <TabsContent value="goals">
                <GoalsTracker />
              </TabsContent>
              <TabsContent value="reports">
                <ReportsView />
              </TabsContent>
              <TabsContent value="settings">
                <SettingsPanel />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
