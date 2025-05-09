
import React from "react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "../../utils/formatters";

interface ExpensesByCategoryChartProps {
  categoryTotals: Record<string, number>;
}

const ExpensesByCategoryChart: React.FC<ExpensesByCategoryChartProps> = ({ 
  categoryTotals 
}) => {
  const categoryColors: Record<string, string> = {
    "Groceries": "#4CAF50",
    "Dining": "#F97316",
    "Entertainment": "#9C27B0",
    "Transportation": "#2196F3",
    "Utilities": "#FF9800",
    "Shopping": "#F44336",
    "Healthcare": "#009688",
    "Housing": "#3F51B5",
    "Uncategorized": "#9E9E9E"
  };

  // Convert the object to an array and sort by amount
  const categories = Object.entries(categoryTotals)
    .map(([name, amount]) => ({
      name,
      amount,
      color: categoryColors[name] || "#9E9E9E"
    }))
    .sort((a, b) => b.amount - a.amount);

  // Calculate the total amount
  const totalAmount = categories.reduce((sum, category) => sum + category.amount, 0);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Expenses By Category</h3>
      
      {categories.length === 0 ? (
        <p className="text-center text-muted-foreground py-6">
          No expenses for this month
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex mb-6">
            <div className="w-full h-8 flex rounded-md overflow-hidden">
              {categories.map((category) => (
                <div 
                  key={category.name}
                  className="h-full"
                  style={{ 
                    backgroundColor: category.color,
                    width: `${(category.amount / totalAmount) * 100}%`
                  }}
                  title={`${category.name}: ${formatCurrency(category.amount)}`}
                ></div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span>{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{formatCurrency(category.amount)}</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round((category.amount / totalAmount) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ExpensesByCategoryChart;
