
import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TransactionItem from "../components/transactions/TransactionItem";
import { useFinanceData } from "../hooks/useDeviceFeatures";

const Transactions: React.FC = () => {
  const { transactions } = useFinanceData();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  // Get unique categories
  const categories = ["all", ...new Set(transactions.map((t) => t.category))];

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.location &&
        transaction.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      categoryFilter === "all" || transaction.category === categoryFilter;

    let matchesTime = true;
    if (timeFilter !== "all") {
      const now = new Date();
      const transactionDate = new Date(transaction.date);
      const daysDiff = Math.floor(
        (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      switch (timeFilter) {
        case "week":
          matchesTime = daysDiff <= 7;
          break;
        case "month":
          matchesTime = daysDiff <= 30;
          break;
        case "quarter":
          matchesTime = daysDiff <= 90;
          break;
      }
    }

    return matchesSearch && matchesCategory && matchesTime;
  });

  return (
    <div className="p-4 pb-20 min-h-screen">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">Manage your financial activity</p>
      </header>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search transactions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="quarter">Last 90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
