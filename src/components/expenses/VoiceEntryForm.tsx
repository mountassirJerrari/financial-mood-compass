
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, Square, Play, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useVoiceRecording, useFinanceData, Transaction } from "../../hooks/useDeviceFeatures";
import { parseMockExpenseFromText } from "../../utils/parsers";

const VoiceEntryForm: React.FC = () => {
  const navigate = useNavigate();
  const { isRecording, audioUrl, transcript, startRecording, stopRecording } = useVoiceRecording();
  const { addTransaction } = useFinanceData();
  const [parsedTransaction, setParsedTransaction] = useState<Partial<Transaction> | null>(null);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);

  // Generate random waveform animation during recording
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setWaveformBars(Array.from({ length: 20 }, () => Math.random() * 0.8 + 0.2));
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setWaveformBars([]);
    }
  }, [isRecording]);

  // Process transcript when available
  useEffect(() => {
    if (transcript) {
      const parsed = parseMockExpenseFromText(transcript);
      setParsedTransaction(parsed);
    }
  }, [transcript]);

  const handleRecord = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleReset = () => {
    setParsedTransaction(null);
  };

  const handleConfirm = () => {
    if (parsedTransaction) {
      addTransaction({
        id: "",  // This will be set in addTransaction
        date: parsedTransaction.date || new Date().toISOString(),
        amount: parsedTransaction.amount || 0,
        description: parsedTransaction.description || "Voice entry",
        category: parsedTransaction.category || "Uncategorized",
        type: parsedTransaction.type || "expense"
      });
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col">
      <Card className="p-6 mb-6 flex flex-col items-center">
        <div className="relative w-full h-32 flex items-center justify-center mb-4">
          {isRecording ? (
            <div className="flex items-end h-20 space-x-1">
              {waveformBars.map((height, index) => (
                <div
                  key={index}
                  className="w-2 bg-primary animate-wave"
                  style={{ 
                    height: `${height * 100}%`,
                    animationDelay: `${index * 0.05}s`
                  }}
                ></div>
              ))}
            </div>
          ) : (
            <Mic className="h-16 w-16 text-muted-foreground" />
          )}
        </div>

        {transcript && (
          <div className="w-full bg-muted p-3 rounded-md mb-4 text-center">
            <p className="font-medium">{transcript}</p>
          </div>
        )}

        {audioUrl && (
          <audio controls src={audioUrl} className="w-full mb-4" />
        )}

        <Button
          onClick={handleRecord}
          className={`${isRecording ? "bg-status-negative" : "bg-primary"} w-16 h-16 rounded-full`}
        >
          {isRecording ? <Square className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          {isRecording ? "Tap to stop recording" : "Tap to start recording"}
        </p>
      </Card>

      {parsedTransaction && (
        <Card className="p-4 mb-6">
          <h3 className="font-medium mb-2">Recognized Expense</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">${parsedTransaction.amount?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{parsedTransaction.category}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">{parsedTransaction.description}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              <RotateCw className="h-4 w-4 mr-2" /> Reset
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              Confirm
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VoiceEntryForm;
