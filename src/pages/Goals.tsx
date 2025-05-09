
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import GoalProgress from "../components/goals/GoalProgress";
import AddGoalForm from "../components/goals/AddGoalForm";
import { useFinanceData } from "../hooks/useDeviceFeatures";

const Goals: React.FC = () => {
  const { goals } = useFinanceData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="p-4 pb-20">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Financial Goals</h1>
        <p className="text-muted-foreground">Track your progress</p>
      </header>

      <div className="space-y-4 mb-6">
        {goals.length > 0 ? (
          goals.map((goal) => <GoalProgress key={goal.id} goal={goal} />)
        ) : (
          <div className="text-center p-8 bg-muted/30 rounded-lg">
            <p className="text-muted-foreground">No goals yet</p>
            <p className="text-sm">Create your first financial goal to get started</p>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full flex items-center justify-center">
            <Plus className="mr-2 h-4 w-4" /> Add New Goal
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
          </DialogHeader>
          <AddGoalForm onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Goal Insights</h2>
        <div className="bg-card p-4 rounded-lg">
          <p className="text-sm mb-4">
            Setting clear financial goals increases your likelihood of saving regularly by up to 70%.
          </p>
          <div className="bg-muted p-3 rounded-md">
            <h3 className="font-medium text-sm mb-1">Tips for Success</h3>
            <ul className="text-sm space-y-2 list-disc pl-4">
              <li>Break large goals into smaller milestones</li>
              <li>Set up automatic contributions</li>
              <li>Review and adjust your goals quarterly</li>
              <li>Celebrate progress along the way</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
