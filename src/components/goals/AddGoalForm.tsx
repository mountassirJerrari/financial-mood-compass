
import React, { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useFinanceData, Goal } from "../../hooks/useDeviceFeatures";

interface AddGoalFormProps {
  onSuccess: () => void;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({ onSuccess }) => {
  const { addGoal } = useFinanceData();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !amount || isNaN(parseFloat(amount))) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Random color from our palette
    const colors = ["#2A9D8F", "#E76F51", "#E9C46A", "#84A98C", "#264653"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newGoal: Omit<Goal, "id"> = {
      name,
      targetAmount: parseFloat(amount),
      currentAmount: 0,
      deadline: date?.toISOString(),
      category: "Savings",
      createdAt: new Date().toISOString(),
      color: randomColor
    };
    
    addGoal(newGoal as Goal);
    
    setIsSubmitting(false);
    onSuccess();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2">
      <div className="space-y-2">
        <Label htmlFor="name">Goal Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Vacation Fund"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="amount">Target Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-8"
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Target Date (Optional)</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="pt-4">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Goal..." : "Create Goal"}
        </Button>
      </div>
    </form>
  );
};

export default AddGoalForm;
