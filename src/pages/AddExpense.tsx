
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VoiceEntryForm from "../components/expenses/VoiceEntryForm";
import CameraEntryForm from "../components/expenses/CameraEntryForm";
import ManualEntryForm from "../components/expenses/ManualEntryForm";
import { Mic, Camera, Plus } from "lucide-react";

const AddExpense: React.FC = () => {
  const navigate = useNavigate();
  const { method } = useParams();
  const [activeTab, setActiveTab] = useState(method || "manual");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/add-expense/${value}`);
  };

  return (
    <div className="p-4 pb-20">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Add Expense</h1>
        <p className="text-muted-foreground">Record your transaction</p>
      </header>

      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-full mb-8">
          <TabsTrigger value="voice" className="flex flex-col items-center py-2">
            <Mic className="h-5 w-5 mb-1" />
            <span className="text-xs">Voice</span>
          </TabsTrigger>
          <TabsTrigger value="camera" className="flex flex-col items-center py-2">
            <Camera className="h-5 w-5 mb-1" />
            <span className="text-xs">Camera</span>
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex flex-col items-center py-2">
            <Plus className="h-5 w-5 mb-1" />
            <span className="text-xs">Manual</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="voice" className="mt-0">
          <VoiceEntryForm />
        </TabsContent>
        
        <TabsContent value="camera" className="mt-0">
          <CameraEntryForm />
        </TabsContent>
        
        <TabsContent value="manual" className="mt-0">
          <ManualEntryForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AddExpense;
