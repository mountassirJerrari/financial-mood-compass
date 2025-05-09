
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "../../utils/formatters";

interface FinancialSnapshotProps {
  spent: number;
  income: number;
  percentage: number;
}

const FinancialSnapshot: React.FC<FinancialSnapshotProps> = ({ spent, income, percentage }) => {
  const getStatusColor = () => {
    if (percentage < 70) return "bg-status-positive";
    if (percentage < 90) return "bg-status-warning";
    return "bg-status-negative";
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-teal-DEFAULT/10 to-background">
      <CardContent className="p-6">
        <div className="flex flex-col">
          <h2 className="font-cabinet text-lg mb-2 font-medium">Monthly Overview</h2>
          
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Spent</p>
              <p className="text-2xl font-cabinet font-semibold finance-number">
                {formatCurrency(spent)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Income</p>
              <p className="text-2xl font-cabinet font-semibold finance-number">
                {formatCurrency(income)}
              </p>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between mb-1 items-center">
              <span className="text-sm text-muted-foreground">Budget Usage</span>
              <span className="text-sm font-medium">{Math.round(percentage)}%</span>
            </div>
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getStatusColor()}`} 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSnapshot;
