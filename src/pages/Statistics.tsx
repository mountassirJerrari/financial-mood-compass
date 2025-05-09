
import React, { useState } from "react";
import { 
  ChartBar, 
  ChartLine, 
  ChevronRight, 
  ChevronLeft,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinanceData } from "../hooks/useDeviceFeatures";
import { formatCurrency } from "../utils/formatters";
import ExpensesByCategoryChart from "../components/statistics/ExpensesByCategoryChart";
import MonthlySpendingChart from "../components/statistics/MonthlySpendingChart";

const Statistics: React.FC = () => {
  const { transactions, budgets } = useFinanceData();
  const [timeFrame, setTimeFrame] = useState<"week" | "month" | "year">("month");
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const now = new Date();
    const isCurrentMonthYear = currentYear === now.getFullYear() && currentMonth === now.getMonth();
    
    if (!isCurrentMonthYear) {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  // Filter transactions based on selected month
  const filteredTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
  });

  // Calculate monthly totals
  const monthlyExpenseTotal = filteredTransactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlyIncomeTotal = filteredTransactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate category totals
  const categoryTotals = filteredTransactions
    .filter(tx => tx.type === "expense")
    .reduce((acc: Record<string, number>, tx) => {
      const category = tx.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + tx.amount;
      return acc;
    }, {});

  // Calculate budget usage
  const budgetUsage = budgets.map(budget => {
    const spent = categoryTotals[budget.category] || 0;
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    return {
      ...budget,
      spent,
      percentage: Math.min(percentage, 100)
    };
  });

  return (
    <div className="p-4 pb-20">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Statistics</h1>
        <p className="text-muted-foreground">Track your financial patterns</p>
      </header>

      {/* Time period selector */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h2 className="text-lg font-medium">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleNextMonth}
          disabled={currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Monthly summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="p-4 bg-teal-DEFAULT/5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Income</p>
            <TrendingUp className="h-4 w-4 text-teal-DEFAULT" />
          </div>
          <p className="text-2xl font-cabinet font-semibold finance-number">
            {formatCurrency(monthlyIncomeTotal)}
          </p>
        </Card>
        
        <Card className="p-4 bg-coral-DEFAULT/5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Expenses</p>
            <TrendingDown className="h-4 w-4 text-coral-DEFAULT" />
          </div>
          <p className="text-2xl font-cabinet font-semibold finance-number">
            {formatCurrency(monthlyExpenseTotal)}
          </p>
        </Card>
      </div>

      {/* Statistics tabs */}
      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="categories" className="flex items-center">
            <ChartBar className="h-4 w-4 mr-2" />
            <span>Categories</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center">
            <ChartLine className="h-4 w-4 mr-2" />
            <span>Trends</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-4">
          <ExpensesByCategoryChart categoryTotals={categoryTotals} />
          
          <h3 className="text-lg font-medium mt-6 mb-3">Budget Usage</h3>
          <div className="space-y-4">
            {budgetUsage.map((budget) => (
              <div key={budget.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span>{budget.category}</span>
                  <span className="text-sm">
                    {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all" 
                    style={{ 
                      width: `${budget.percentage}%`,
                      backgroundColor: budget.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <MonthlySpendingChart transactions={transactions} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
