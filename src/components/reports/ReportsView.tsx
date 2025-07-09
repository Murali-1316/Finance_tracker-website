import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, BarChart3, TrendingUp, Calendar } from "lucide-react";
import { useFinanceStore } from "@/stores/financeStore";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency } from "@/lib/utils";

export const ReportsView = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  const { transactions, accounts, categories } = useFinanceStore();

  // Generate monthly income/expense data
  const generateMonthlyData = () => {
    const filteredTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return tDate >= startDate && tDate <= endDate;
    });

    const months = new Map();
    
    // Initialize months in range
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    
    for (let d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const monthName = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      months.set(key, { month: monthName, income: 0, expenses: 0 });
    }

    // Aggregate transactions by month
    filteredTransactions.forEach(t => {
      const tDate = new Date(t.date);
      const key = `${tDate.getFullYear()}-${tDate.getMonth()}`;
      const monthData = months.get(key);
      
      if (monthData) {
        if (t.type === 'income') {
          monthData.income += t.amount;
        } else {
          monthData.expenses += Math.abs(t.amount);
        }
      }
    });

    return Array.from(months.values());
  };

  // Generate category spending data
  const generateCategoryData = () => {
    const filteredTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      const startDate = new Date(dateRange.startDate);
      const endDate = new Date(dateRange.endDate);
      return tDate >= startDate && tDate <= endDate && t.type === 'expense';
    });

    const categoryTotals = new Map();
    
    filteredTransactions.forEach(t => {
      const current = categoryTotals.get(t.category) || 0;
      categoryTotals.set(t.category, current + Math.abs(t.amount));
    });

    return Array.from(categoryTotals.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const monthlyData = generateMonthlyData();
  const categoryData = generateCategoryData();
  
  const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0);
  const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0);
  const netIncome = totalIncome - totalExpenses;
  const avgMonthlyIncome = totalIncome / (monthlyData.length || 1);
  const avgMonthlyExpenses = totalExpenses / (monthlyData.length || 1);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  const pieData = categoryData.slice(0, 8).map((item, index) => ({
    name: item.category,
    value: item.amount,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Financial Reports</h2>
          <p className="text-gray-600 dark:text-gray-300">Analyze your financial data and trends</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="mr-2 h-4 w-4" />
          Export Reports
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Report Period</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setDateRange({
                  startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0]
                })}
              >
                This Year
              </Button>
              <Button 
                variant="outline"
                onClick={() => setDateRange({
                  startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1).toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0]
                })}
              >
                Last 6 Months
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-green-100 text-sm font-medium">Total Income</p>
              <p className="text-2xl font-bold">{formatCurrency(totalIncome)}</p>
              <p className="text-xs text-green-100 mt-1">
                Avg: {formatCurrency(avgMonthlyIncome)}/mo
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-100 text-sm font-medium">Total Expenses</p>
              <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
              <p className="text-xs text-red-100 mt-1">
                Avg: {formatCurrency(avgMonthlyExpenses)}/mo
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-r ${netIncome >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white`}>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-white/80 text-sm font-medium">Net Income</p>
              <p className="text-2xl font-bold">{formatCurrency(netIncome)}</p>
              <p className="text-xs text-white/80 mt-1">
                {netIncome >= 0 ? 'Surplus' : 'Deficit'}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-purple-100 text-sm font-medium">Savings Rate</p>
              <p className="text-2xl font-bold">
                {totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-purple-100 mt-1">
                Of total income
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trends">Income vs Expenses</TabsTrigger>
          <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
          <TabsTrigger value="accounts">Account Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Income vs Expenses Over Time</CardTitle>
              <CardDescription>Monthly comparison of your income and expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" tickFormatter={(value) => formatCurrency(Number(value))} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="income" name="Income" fill="#10B981" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Visual breakdown of your expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Spending Categories</CardTitle>
                <CardDescription>Your highest expense categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.slice(0, 8).map((item, index) => (
                    <div key={item.category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Account Balances</CardTitle>
              <CardDescription>Current balance across all your accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accounts.map((account) => (
                  <div key={account.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{account.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {account.type} • {account.institution}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-semibold ${
                        account.balance >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatCurrency(account.balance)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
