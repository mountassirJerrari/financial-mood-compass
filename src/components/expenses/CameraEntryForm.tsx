
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, X, Check, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCamera, useFinanceData, Transaction } from "../../hooks/useDeviceFeatures";
import { parseMockReceiptData } from "../../utils/parsers";

const CameraEntryForm: React.FC = () => {
  const navigate = useNavigate();
  const { videoRef, image, setImage, isCameraActive, startCamera, stopCamera, captureImage } = useCamera();
  const { addTransaction } = useFinanceData();
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<Partial<Transaction> | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Initialize camera when component mounts
  useEffect(() => {
    const initCamera = async () => {
      const success = await startCamera();
      if (!success) {
        setCameraError("Camera initialization failed. Please check permissions.");
      } else {
        setCameraError(null);
      }
    };
    
    initCamera();
    
    // Cleanup function to ensure camera is stopped when component unmounts
    return () => {
      stopCamera();
    };
  }, []);

  const handleCapture = () => {
    captureImage();
    stopCamera();
    setIsProcessing(true);
    
    // Simulate receipt processing
    setTimeout(() => {
      const mockData = parseMockReceiptData();
      setReceiptData(mockData);
      setIsProcessing(false);
    }, 1500);
  };

  const handleReset = async () => {
    setImage(null);
    setReceiptData(null);
    setCameraError(null);
    const success = await startCamera();
    if (!success) {
      setCameraError("Failed to restart camera. Please try again.");
    }
  };

  const handleConfirm = () => {
    if (receiptData) {
      addTransaction({
        id: "",  // This will be set in addTransaction
        date: receiptData.date || new Date().toISOString(),
        amount: receiptData.amount || 0,
        description: receiptData.description || "Receipt scan",
        category: receiptData.category || "Uncategorized",
        type: "expense",
        location: receiptData.location
      });
      
      // Make sure we stop the camera and clean up when navigating away
      stopCamera();
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col">
      <Card className="p-4 mb-6 overflow-hidden">
        <div className="relative rounded-md overflow-hidden bg-black mb-4 aspect-[4/3]">
          {isCameraActive ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className="w-full h-full object-cover"
              style={{ display: "block" }}  {/* Force display block */}
            />
          ) : image ? (
            <img 
              src={image} 
              alt="Captured receipt"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              {cameraError ? (
                <div className="text-center p-4">
                  <p className="text-red-500 mb-2">{cameraError}</p>
                  <Button variant="outline" onClick={handleReset}>
                    Retry Camera Access
                  </Button>
                </div>
              ) : (
                <Camera className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
          )}
          
          {/* Camera guides overlay */}
          {isCameraActive && (
            <div className="absolute inset-0 border-2 border-dashed border-white/50 pointer-events-none">
              <div className="absolute top-1/4 w-full border-t border-dashed border-white/50"></div>
              <div className="absolute top-3/4 w-full border-t border-dashed border-white/50"></div>
              <div className="absolute left-1/4 h-full border-l border-dashed border-white/50"></div>
              <div className="absolute left-3/4 h-full border-l border-dashed border-white/50"></div>
            </div>
          )}
        </div>

        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin mb-2" />
            <p>Processing receipt...</p>
          </div>
        ) : receiptData ? (
          <div className="space-y-3 p-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-medium">${receiptData.amount?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">
                  {receiptData.date ? new Date(receiptData.date).toLocaleDateString() : "Today"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Merchant</p>
              <p className="font-medium">{receiptData.location || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{receiptData.category || "Uncategorized"}</p>
            </div>
            
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                <X className="h-4 w-4 mr-2" /> Retake
              </Button>
              <Button onClick={handleConfirm} className="flex-1">
                <Check className="h-4 w-4 mr-2" /> Confirm
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={handleCapture} 
            className="w-16 h-16 rounded-full mx-auto mt-2 bg-primary"
            disabled={!isCameraActive || !!cameraError}
          >
            <Camera className="h-6 w-6" />
          </Button>
        )}
      </Card>

      <div className="text-sm text-muted-foreground text-center">
        <p>Position your receipt in the frame and ensure good lighting.</p>
        <p>The app will automatically detect and extract the information.</p>
      </div>
    </div>
  );
};

export default CameraEntryForm;
