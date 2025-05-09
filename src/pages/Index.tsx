
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Mic, 
  Camera, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  MessageCircle
} from "lucide-react";
import { useFinanceData, Transaction } from "../hooks/useDeviceFeatures";
import FinancialSnapshot from "../components/dashboard/FinancialSnapshot";
import TransactionItem from "../components/transactions/TransactionItem";
import GoalProgress from "../components/goals/GoalProgress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "../utils/formatters";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, goals, summary } = useFinanceData();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const recentTransactions = transactions.slice(0, 5);

  const toggleQuickAdd = () => {
    setShowQuickAdd(!showQuickAdd);
  };

  return (
    <div className="p-4 pb-20 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Hello, Sam</h1>
        <p className="text-muted-foreground">Let's manage your money</p>
      </header>

      {/* Financial Snapshot */}
      <FinancialSnapshot 
        spent={summary.totalSpent} 
        income={summary.totalIncome}
        percentage={summary.budgetUsedPercentage} 
      />

      {/* Recent Transactions */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm flex items-center" 
            onClick={() => navigate('/transactions')}
          >
            See all <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      </section>

      {/* Goals Section */}
      <section className="mt-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold">Your Goals</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm flex items-center" 
            onClick={() => navigate('/goals')}
          >
            See all <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="space-y-4">
          {goals.slice(0, 2).map((goal) => (
            <GoalProgress key={goal.id} goal={goal} />
          ))}
        </div>
      </section>

      {/* Balance Overview */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Balance Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-teal-DEFAULT/5">
            <p className="text-sm text-muted-foreground">Total Balance</p>
            <p className="text-2xl font-cabinet font-semibold finance-number">
              {formatCurrency(summary.netAmount)}
            </p>
          </Card>
          <Card className="p-4 bg-coral-DEFAULT/5">
            <p className="text-sm text-muted-foreground">Monthly Spending</p>
            <p className="text-2xl font-cabinet font-semibold finance-number">
              {formatCurrency(summary.totalSpent)}
            </p>
          </Card>
        </div>
      </section>

      {/* AI Assistant Button */}
      <button 
        onClick={() => navigate('/ai-assistant')}
        className="fixed bottom-20 left-4 z-10 bg-primary/10 backdrop-blur-sm border border-primary/20 text-primary p-3 rounded-full shadow-lg animate-pulse-light"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Quick Add Button */}
      <div className="floating-action-button">
        <button onClick={toggleQuickAdd} className="h-full w-full rounded-full flex items-center justify-center">
          <Plus className="h-6 w-6" />
        </button>

        {showQuickAdd && (
          <div className="absolute bottom-16 right-0 bg-card rounded-lg shadow-lg p-2 animate-scale-in">
            <Button
              variant="ghost"
              className="flex items-center w-full justify-start mb-2"
              onClick={() => navigate('/add-expense/voice')}
            >
              <Mic className="h-5 w-5 mr-2" />
              Voice Entry
            </Button>
            <Button
              variant="ghost"
              className="flex items-center w-full justify-start mb-2"
              onClick={() => navigate('/add-expense/camera')}
            >
              <Camera className="h-5 w-5 mr-2" />
              Receipt Scan
            </Button>
            <Button
              variant="ghost"
              className="flex items-center w-full justify-start"
              onClick={() => navigate('/add-expense/manual')}
            >
              <Plus className="h-5 w-5 mr-2" />
              Manual Entry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
