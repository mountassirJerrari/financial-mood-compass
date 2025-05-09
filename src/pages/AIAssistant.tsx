
import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useVoiceRecording } from "../hooks/useDeviceFeatures";
import { formatCurrency } from "../utils/formatters";
import { simulateAIResponse } from "../utils/ai-simulator";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  hasChart?: boolean;
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hi there! I'm your AI financial assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isRecording, audioUrl, transcript, startRecording, stopRecording } = useVoiceRecording();
  
  const suggestedQuestions = [
    "How much did I spend on dining last month?",
    "What's my current balance?",
    "How am I doing on my savings goal?",
    "Show me my biggest expenses"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript) {
      handleSendMessage(transcript);
    }
  }, [transcript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: text,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(async () => {
      const response = await simulateAIResponse(text);
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: response.text,
        sender: "ai",
        timestamp: new Date(),
        hasChart: response.hasChart
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 pb-20">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">AI Assistant</h1>
        <p className="text-muted-foreground">Your financial advisor</p>
      </header>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={
                message.sender === "user" ? "chat-bubble-user" : "chat-bubble-ai"
              }
            >
              <p>{message.text}</p>
              
              {message.hasChart && (
                <Card className="mt-3 p-3 bg-background/50 backdrop-blur-sm">
                  <h3 className="font-medium text-sm mb-2">Monthly Spending Overview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Dining</span>
                      <div className="flex items-center">
                        <div className="h-2 bg-coral-DEFAULT rounded-full w-24 mr-2">
                          <div 
                            className="h-full bg-coral-light rounded-full" 
                            style={{ width: "65%" }}
                          ></div>
                        </div>
                        <span className="text-sm">{formatCurrency(320)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Groceries</span>
                      <div className="flex items-center">
                        <div className="h-2 bg-teal-DEFAULT rounded-full w-24 mr-2">
                          <div 
                            className="h-full bg-teal-light rounded-full" 
                            style={{ width: "80%" }}
                          ></div>
                        </div>
                        <span className="text-sm">{formatCurrency(425)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Entertainment</span>
                      <div className="flex items-center">
                        <div className="h-2 bg-gold-DEFAULT rounded-full w-24 mr-2">
                          <div 
                            className="h-full bg-gold-light rounded-full" 
                            style={{ width: "45%" }}
                          ></div>
                        </div>
                        <span className="text-sm">{formatCurrency(180)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="chat-bubble-ai">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Suggested Questions */}
      <div className="mb-4 overflow-x-auto whitespace-nowrap pb-2 flex space-x-2">
        {suggestedQuestions.map((question, index) => (
          <Badge 
            key={index} 
            variant="outline"
            className="cursor-pointer py-1 px-3"
            onClick={() => handleSendMessage(question)}
          >
            {question}
          </Badge>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          size="icon"
          variant={isRecording ? "destructive" : "outline"}
          onClick={handleVoiceInput}
        >
          {isRecording ? <X className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Input
          type="text"
          placeholder="Type your question..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(inputText);
            }
          }}
        />
        <Button size="icon" onClick={() => handleSendMessage(inputText)}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIAssistant;
