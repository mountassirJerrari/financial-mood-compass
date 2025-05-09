
import React from "react";
import { Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Goal } from "../../hooks/useDeviceFeatures";
import { formatCurrency } from "../../utils/formatters";

interface GoalProgressProps {
  goal: Goal;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goal }) => {
  const { name, targetAmount, currentAmount, deadline, color } = goal;
  
  const percentComplete = Math.min((currentAmount / targetAmount) * 100, 100);
  
  // Format deadline if exists
  const formattedDeadline = deadline 
    ? new Date(deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'No deadline';
    
  return (
    <div className="p-4 bg-card rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center mr-2" 
            style={{ backgroundColor: `${color}20` }}
          >
            <Target className="h-4 w-4" style={{ color }} />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-xs text-muted-foreground">Target: {formattedDeadline}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-cabinet font-medium finance-number">
            {formatCurrency(currentAmount)} <span className="text-muted-foreground text-xs">/ {formatCurrency(targetAmount)}</span>
          </p>
        </div>
      </div>
      
      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1">
          <span>{Math.round(percentComplete)}% Complete</span>
          <span>{formatCurrency(targetAmount - currentAmount)} to go</span>
        </div>
        <Progress 
          value={percentComplete} 
          className="h-2" 
          indicatorClassName={color ? `bg-[${color}]` : "bg-teal-DEFAULT"}
        />
      </div>
    </div>
  );
};

export default GoalProgress;
