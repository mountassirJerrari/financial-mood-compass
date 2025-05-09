
import React from "react";
import { Outlet } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import OfflineIndicator from "./OfflineIndicator";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AppLayout: React.FC = () => {
  const [isOffline] = useLocalStorage("isOffline", false);

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      {isOffline && <OfflineIndicator />}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <NavigationBar />
    </div>
  );
};

export default AppLayout;
