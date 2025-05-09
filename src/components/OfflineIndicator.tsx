
import React from "react";
import { Wifi, WifiOff } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useLocalStorage("isOffline", false);

  const toggleOfflineMode = () => {
    setIsOffline(!isOffline);
  };

  return (
    <div className="bg-muted p-2 flex justify-center text-sm items-center">
      <button 
        onClick={toggleOfflineMode}
        className="flex items-center gap-2 px-3 py-1 rounded-full bg-background"
      >
        {isOffline ? (
          <>
            <WifiOff className="h-4 w-4 text-status-negative" />
            <span>Working offline</span>
          </>
        ) : (
          <>
            <Wifi className="h-4 w-4 text-status-positive" />
            <span>Connected</span>
          </>
        )}
      </button>
    </div>
  );
};

export default OfflineIndicator;
