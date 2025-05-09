
import React from "react";
import { ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { Transaction } from "../../hooks/useDeviceFeatures";
import { formatCurrency, formatDate } from "../../utils/formatters";

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { type, amount, description, category, date } = transaction;
  
  const getIcon = () => {
    switch (type) {
      case "income":
        return <ArrowUpRight className="h-5 w-5 text-status-positive" />;
      case "expense":
        return <ArrowDownRight className="h-5 w-5 text-status-negative" />;
      case "transfer":
        return <RefreshCw className="h-5 w-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getCategoryColor = () => {
    // Map categories to specific color classes
    const colorMap: {[key: string]: string} = {
      "Groceries": "bg-teal-light",
      "Dining": "bg-coral-light",
      "Entertainment": "bg-gold-light",
      "Transportation": "bg-sage-light",
      "Utilities": "bg-teal-dark",
      "Shopping": "bg-coral-dark",
      "Healthcare": "bg-gold-dark",
      "Housing": "bg-sage-dark",
      "Salary": "bg-status-positive",
      "Investments": "bg-status-positive",
    };

    return colorMap[category] || "bg-muted";
  };

  return (
    <div className="flex items-center justify-between p-3 bg-card rounded-lg shadow-sm">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full ${getCategoryColor()} flex items-center justify-center mr-3`}>
          {getIcon()}
        </div>
        <div>
          <p className="font-medium">{description}</p>
          <p className="text-xs text-muted-foreground">{formatDate(date)} • {category}</p>
        </div>
      </div>
      <div className={`font-cabinet font-medium finance-number ${type === 'income' ? 'text-status-positive' : ''}`}>
        {type === 'income' ? '+' : ''}{formatCurrency(amount)}
      </div>
    </div>
  );
};

export default TransactionItem;
