
import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, X, MessageSquare, PhoneCall, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useVoiceRecording } from "../hooks/useDeviceFeatures";
import { formatCurrency } from "../utils/formatters";
import { simulateAIResponse } from "../utils/ai-simulator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const [isRealTimeChat, setIsRealTimeChat] = useState(false);
  const [bubbleText, setBubbleText] = useState("");
  const [showBubbles, setShowBubbles] = useState(false);
  const bubbleInterval = useRef<NodeJS.Timeout | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  
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

  useEffect(() => {
    return () => {
      if (bubbleInterval.current) {
        clearInterval(bubbleInterval.current);
      }
    };
  }, []);

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

    if (isRealTimeChat) {
      // Start the bubble animation
      setShowBubbles(true);
      setBubbleText("");
      
      // Simulate real-time response
      const response = await simulateAIResponse(text);
      const fullText = response.text;
      let currentText = "";
      
      // Clear any existing interval
      if (bubbleInterval.current) {
        clearInterval(bubbleInterval.current);
      }
      
      // Gradually reveal text character by character
      bubbleInterval.current = setInterval(() => {
        if (currentText.length < fullText.length) {
          const nextChar = fullText[currentText.length];
          currentText += nextChar;
          setBubbleText(currentText);
        } else {
          if (bubbleInterval.current) {
            clearInterval(bubbleInterval.current);
            bubbleInterval.current = null;
          }
          
          // After the animation completes, add the message to chat history
          setTimeout(() => {
            setShowBubbles(false);
            const aiMessage: Message = {
              id: `ai-${Date.now()}`,
              text: fullText,
              sender: "ai",
              timestamp: new Date(),
              hasChart: response.hasChart
            };
            setMessages(prev => [...prev, aiMessage]);
            setIsLoading(false);
          }, 500);
        }
      }, 30); // Speed of typing animation
    } else {
      // Original behavior
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
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const toggleRealTimeChat = () => {
    setIsRealTimeChat(!isRealTimeChat);
    if (showBubbles) {
      setShowBubbles(false);
      if (bubbleInterval.current) {
        clearInterval(bubbleInterval.current);
        bubbleInterval.current = null;
      }
    }
  };

  const startAICall = () => {
    setIsCallActive(true);
    setIsRealTimeChat(true);
    // Clear messages for a fresh call experience
    setMessages([
      {
        id: `ai-call-${Date.now()}`,
        text: "AI Assistant connected. How can I help with your finances today?",
        sender: "ai",
        timestamp: new Date()
      }
    ]);
  };

  const endAICall = () => {
    setIsCallActive(false);
    // Clean up any ongoing animations
    if (bubbleInterval.current) {
      clearInterval(bubbleInterval.current);
      bubbleInterval.current = null;
    }
    setShowBubbles(false);
  };

  return (
    <div className="flex flex-col h-screen p-4 pb-20">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">AI Assistant</h1>
        <p className="text-muted-foreground">Your financial advisor</p>
      </header>

      {/* AI Call Interface */}
      {isCallActive ? (
        <div className="relative flex-1 flex flex-col items-center bg-gradient-to-b from-primary/5 to-background rounded-lg p-4 overflow-hidden">
          {/* Call Status Indicator */}
          <div className="absolute top-2 right-2 flex items-center space-x-2">
            <span className="animate-pulse h-3 w-3 bg-green-500 rounded-full"></span>
            <span className="text-sm font-medium">Live Call</span>
          </div>
          
          {/* Message Area */}
          <div className="flex-1 w-full overflow-y-auto mb-4 space-y-4 px-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={
                    message.sender === "user" 
                      ? "chat-bubble-user bg-primary/90 text-white" 
                      : "chat-bubble-ai bg-card shadow-lg"
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
                </div>
              </div>
            ))}

            {isLoading && !showBubbles && (
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

          {/* Voice Indicator */}
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/30 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* Typing Indicators */}
          {showBubbles && (
            <div className="mb-6 max-w-xs bg-card rounded-lg p-4 shadow-lg animate-scale-in">
              <p className="text-sm">{bubbleText || "Thinking..."}</p>
              {bubbleText ? null : (
                <div className="flex space-x-1 mt-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              )}
            </div>
          )}

          {/* Call Input Area */}
          <div className="flex items-center space-x-2 w-full max-w-md">
            <Button
              size="icon"
              variant={isRecording ? "destructive" : "outline"}
              onClick={handleVoiceInput}
              className="rounded-full h-10 w-10 flex-shrink-0"
            >
              {isRecording ? <X className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(inputText);
                }
              }}
              className="rounded-full"
            />
            <Button 
              size="icon" 
              onClick={() => handleSendMessage(inputText)}
              className="rounded-full h-10 w-10 flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* End Call Button */}
          <Button 
            variant="destructive" 
            onClick={endAICall}
            className="mt-6 rounded-full px-4"
          >
            <X className="h-4 w-4 mr-2" />
            End Call
          </Button>
        </div>
      ) : (
        <>
          {/* Regular Chat Interface */}
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
            
            {isLoading && !showBubbles && (
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
            
            {showBubbles && (
              <div className="fixed bottom-28 right-4 max-w-[80%] z-20">
                <div className="chat-bubble-ai animate-scale-in flex flex-col">
                  <div className="absolute -top-1 -left-1 w-4 h-4">
                    <div className="absolute animate-ping w-4 h-4 rounded-full bg-primary opacity-75"></div>
                    <div className="relative w-3 h-3 rounded-full bg-primary"></div>
                  </div>
                  <p>{bubbleText || "Thinking..."}</p>
                  {bubbleText ? null : (
                    <div className="flex space-x-1 mt-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Start AI Call Button */}
          <div className="mb-3 flex justify-center">
            <Button
              variant="default"
              size="lg"
              onClick={startAICall}
              className="flex items-center gap-2 rounded-full px-6 shadow-md"
            >
              <PhoneCall className="h-4 w-4" />
              Start AI Conversation
            </Button>
          </div>
          
          {/* Chat Mode Toggle */}
          <div className="mb-3 flex justify-end items-center space-x-2">
            <Label htmlFor="real-time-mode" className="text-sm">Real-time mode</Label>
            <Switch
              id="real-time-mode"
              checked={isRealTimeChat}
              onCheckedChange={toggleRealTimeChat}
            />
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
        </>
      )}
    </div>
  );
};

export default AIAssistant;
