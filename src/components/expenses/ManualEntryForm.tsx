
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useFinanceData } from "../../hooks/useDeviceFeatures";
import CategorySelector from "./CategorySelector";

const ManualEntryForm: React.FC = () => {
  const navigate = useNavigate();
  const { addTransaction } = useFinanceData();
  
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [date, setDate] = useState<Date>(new Date());
  const [type, setType] = useState("expense");
  const [location, setLocation] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(parseFloat(amount))) {
      return; // Add proper validation
    }
    
    addTransaction({
      id: "",
      date: date.toISOString(),
      amount: parseFloat(amount),
      description,
      category,
      type: type as "income" | "expense" | "transfer",
      location
    });
    
    navigate("/");
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="expense-entry-step">
        <label className="text-sm font-medium mb-1">Amount</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">$</span>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-8 text-2xl font-cabinet finance-number h-14 text-right"
            placeholder="0.00"
            step="0.01"
            required
          />
        </div>
      </div>
      
      <div className="expense-entry-step">
        <label className="text-sm font-medium mb-1">Type</label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Expense</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="expense-entry-step">
        <label className="text-sm font-medium mb-1">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
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
              onSelect={(date) => date && setDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="expense-entry-step">
        <label className="text-sm font-medium mb-1">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What was this for?"
          className="resize-none"
          rows={2}
        />
      </div>
      
      <div className="expense-entry-step">
        <label className="text-sm font-medium mb-1">Category</label>
        <CategorySelector
          selectedCategory={category}
          onSelectCategory={setCategory}
        />
      </div>
      
      <div className="expense-entry-step">
        <label className="text-sm font-medium mb-1">Location (Optional)</label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Store or merchant name"
        />
      </div>
      
      <Button type="submit" className="w-full">
        Save Transaction
      </Button>
    </form>
  );
};

export default ManualEntryForm;
