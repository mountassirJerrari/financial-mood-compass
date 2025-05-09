
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "./useLocalStorage";

export const useCamera = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      // First make sure to stop any existing streams
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        return true;
      }
      return false;
    } catch (err) {
      toast.error("Failed to access camera");
      console.error("Error accessing camera:", err);
      return false;
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && streamRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        setImage(dataUrl);
        toast.success("Image captured");
        return dataUrl;
      }
    }
    return null;
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    image,
    isCameraActive,
    startCamera,
    stopCamera,
    captureImage,
    setImage
  };
};

export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      // Ensure any existing streams are stopped
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Simulate transcription with predefined responses
        simulateTranscription();
      };

      mediaRecorder.start();
      setIsRecording(true);
      return true;
    } catch (error) {
      toast.error("Failed to access microphone");
      console.error("Error starting recording:", error);
      return false;
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  const simulateTranscription = () => {
    // Simulate AI processing with predefined responses
    const predefinedTranscripts = [
      "Spent $45 on lunch today at Italian restaurant",
      "Add $120 for the electricity bill",
      "Transfer $200 to my savings account",
      "New expense of $85 for groceries at Whole Foods",
      "Coffee shop purchase for $4.75"
    ];

    // Simulate processing delay
    setTimeout(() => {
      const randomTranscript = predefinedTranscripts[Math.floor(Math.random() * predefinedTranscripts.length)];
      setTranscript(randomTranscript);
      toast.success("Voice processed successfully");
    }, 1000);
  };

  useEffect(() => {
    return () => {
      // Cleanup function to ensure audio resources are released when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return {
    isRecording,
    audioUrl,
    transcript,
    startRecording,
    stopRecording
  };
};

export const useFinanceData = () => {
  const [transactionData, setTransactionData] = useLocalStorage("transactions", generateMockTransactions());
  const [budgetData, setBudgetData] = useLocalStorage("budgets", generateMockBudgets());
  const [goals, setGoals] = useLocalStorage("goals", generateMockGoals());

  // Calculate summary data
  const calculateSummary = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filter transactions for current month
    const monthTransactions = transactionData.filter(transaction => {
      const txDate = new Date(transaction.date);
      return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });
    
    // Calculate total spent this month
    const totalSpent = monthTransactions
      .filter(tx => tx.type === "expense")
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    // Calculate total income this month
    const totalIncome = monthTransactions
      .filter(tx => tx.type === "income")
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    // Calculate budget usage percentage
    const totalBudget = budgetData.reduce((sum, budget) => sum + budget.amount, 0);
    const budgetUsedPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    
    return {
      totalSpent,
      totalIncome,
      netAmount: totalIncome - totalSpent,
      budgetUsedPercentage: Math.min(budgetUsedPercentage, 100),
      transactionCount: monthTransactions.length
    };
  };

  // Add new transaction
  const addTransaction = (transaction: Transaction) => {
    setTransactionData([...transactionData, { ...transaction, id: `tx-${Date.now()}` }]);
    toast.success("Transaction added");
  };

  // Update budget
  const updateBudget = (categoryId: string, newAmount: number) => {
    setBudgetData(
      budgetData.map(budget => 
        budget.categoryId === categoryId 
          ? { ...budget, amount: newAmount } 
          : budget
      )
    );
  };

  // Add new goal
  const addGoal = (goal: Goal) => {
    setGoals([...goals, { ...goal, id: `goal-${Date.now()}`, createdAt: new Date().toISOString() }]);
    toast.success("Goal added");
  };

  // Update goal progress
  const updateGoalProgress = (goalId: string, contributionAmount: number) => {
    setGoals(
      goals.map(goal => 
        goal.id === goalId 
          ? {
              ...goal,
              currentAmount: goal.currentAmount + contributionAmount,
              lastUpdated: new Date().toISOString()
            }
          : goal
      )
    );
  };

  return {
    transactions: transactionData,
    budgets: budgetData,
    goals,
    summary: calculateSummary(),
    addTransaction,
    updateBudget,
    addGoal,
    updateGoalProgress
  };
};

// Types
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: "income" | "expense" | "transfer";
  paymentMethod?: string;
  location?: string;
  tags?: string[];
}

export interface Budget {
  id: string;
  categoryId: string;
  category: string;
  amount: number;
  spent: number;
  period: "weekly" | "monthly" | "yearly";
  color: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category: string;
  createdAt: string;
  lastUpdated?: string;
  color: string;
}

// Mock data generators
function generateMockTransactions(): Transaction[] {
  const categories = [
    "Groceries", "Dining", "Entertainment", "Transportation", 
    "Utilities", "Shopping", "Healthcare", "Housing", "Salary", "Investments"
  ];
  
  const descriptions = [
    "Weekly grocery shopping", "Dinner with friends", "Movie tickets", 
    "Uber ride", "Electricity bill", "New shoes", "Doctor's appointment", 
    "Rent payment", "Monthly salary", "Dividend payment"
  ];
  
  const paymentMethods = ["Credit Card", "Debit Card", "Cash", "Bank Transfer", "Mobile Payment"];
  const locations = ["Walmart", "Amazon", "Target", "Whole Foods", "Trader Joe's", "Starbucks", "Office", "Home"];
  
  const transactions: Transaction[] = [];
  const today = new Date();
  
  // Generate 30 transactions over the last 60 days
  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const date = new Date();
    date.setDate(today.getDate() - daysAgo);
    
    const categoryIndex = Math.floor(Math.random() * categories.length);
    const type = categoryIndex >= 8 ? "income" : "expense"; // Last 2 categories are income
    
    transactions.push({
      id: `tx-${i}-${Date.now()}`,
      date: date.toISOString(),
      amount: Math.round(Math.random() * 200) + 5,
      description: descriptions[categoryIndex],
      category: categories[categoryIndex],
      type,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      tags: [categories[categoryIndex], type]
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function generateMockBudgets(): Budget[] {
  const categories = [
    "Groceries", "Dining", "Entertainment", "Transportation", 
    "Utilities", "Shopping", "Healthcare", "Housing"
  ];
  
  const colors = [
    "#4CAF50", "#2196F3", "#9C27B0", "#FF9800", 
    "#F44336", "#3F51B5", "#009688", "#FFC107"
  ];
  
  return categories.map((category, index) => ({
    id: `budget-${index}`,
    categoryId: `cat-${index}`,
    category,
    amount: Math.round((Math.random() * 500) + 100),
    spent: Math.round((Math.random() * 350) + 50),
    period: "monthly" as const,
    color: colors[index]
  }));
}

function generateMockGoals(): Goal[] {
  const goalNames = [
    "Emergency Fund", "Vacation", "New Car", "Down Payment", "Education"
  ];
  
  const colors = [
    "#4CAF50", "#2196F3", "#9C27B0", "#FF9800", "#F44336"
  ];
  
  return goalNames.map((name, index) => {
    const targetAmount = Math.round((Math.random() * 5000) + 1000);
    const currentAmount = Math.round((Math.random() * targetAmount * 0.8));
    
    // Create a deadline 3-12 months in the future
    const deadline = new Date();
    deadline.setMonth(deadline.getMonth() + Math.floor(Math.random() * 10) + 3);
    
    return {
      id: `goal-${index}`,
      name,
      targetAmount,
      currentAmount,
      deadline: deadline.toISOString(),
      category: "Savings",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      color: colors[index]
    };
  });
}
