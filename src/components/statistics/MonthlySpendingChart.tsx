
import React from "react";
import { Card } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Transaction } from "../../hooks/useDeviceFeatures";
import { formatCurrency } from "../../utils/formatters";

interface MonthlySpendingChartProps {
  transactions: Transaction[];
}

const MonthlySpendingChart: React.FC<MonthlySpendingChartProps> = ({ 
  transactions 
}) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  // Get all months data for the current year
  const monthlySummary = Array.from({ length: 12 }, (_, monthIndex) => {
    // Filter transactions for this month and year
    const monthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === monthIndex && txDate.getFullYear() === currentYear;
    });
    
    // Calculate income and expenses
    const expenses = monthTransactions
      .filter(tx => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const income = monthTransactions
      .filter(tx => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    // Return data for the month
    return {
      name: new Date(currentYear, monthIndex, 1).toLocaleString('default', { month: 'short' }),
      income,
      expenses
    };
  });

  // Only include months up to the current month
  const chartData = monthlySummary.slice(0, currentDate.getMonth() + 1);
  
  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-2 border rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-teal-DEFAULT">
            Income: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-coral-DEFAULT">
            Expenses: {formatCurrency(payload[1].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Monthly Income and Expenses</h3>
      
      <div className="h-64 mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => formatCurrency(value).replace('$', '')} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="income" 
              name="Income" 
              fill="#33C3F0" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
            <Bar 
              dataKey="expenses" 
              name="Expenses" 
              fill="#F97316" 
              radius={[4, 4, 0, 0]} 
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default MonthlySpendingChart;
