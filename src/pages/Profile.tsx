
import React, { useState } from "react";
import {
  User,
  Bell,
  Moon,
  Sun,
  Database,
  LogOut,
  Shield,
  WifiOff,
  Trash2,
  Download
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "../hooks/useTheme";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useFinanceData } from "../hooks/useDeviceFeatures";
import { toast } from "sonner";

const Profile: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOffline, setIsOffline] = useLocalStorage("isOffline", false);
  const { transactions } = useFinanceData();
  
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(true);

  const mockUserData = {
    name: "Sam Johnson",
    email: "sam.johnson@example.com",
    avatar: "SJ"
  };

  const handleExportData = () => {
    // Create a data URL for the JSON data
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions));
    
    // Create a temporary anchor element and trigger the download
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "my_financial_data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast.success("Data exported successfully");
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all your data? This action cannot be undone.")) {
      localStorage.clear();
      toast.success("All data cleared successfully");
      // In a real app, we'd reload or redirect here
      setTimeout(() => window.location.reload(), 1500);
    }
  };

  return (
    <div className="p-4 pb-20">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </header>

      {/* User Profile Card */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-medium">
            {mockUserData.avatar}
          </div>
          <div>
            <CardTitle>{mockUserData.name}</CardTitle>
            <CardDescription>{mockUserData.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            <User className="h-4 w-4 mr-2" /> Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Settings */}
      <div className="space-y-6">
        {/* Appearance */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Appearance</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {theme === "dark" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <span>Dark Mode</span>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Notifications</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about important updates
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              
              <Separator />
              
              <div>
                <Label htmlFor="email-frequency" className="font-medium">
                  Email Digest Frequency
                </Label>
                <select 
                  id="email-frequency"
                  className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2"
                >
                  <option>Weekly</option>
                  <option>Monthly</option>
                  <option>Never</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Security</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="biometrics" className="font-medium">
                    Biometric Authentication
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Use Face ID or fingerprint to login
                  </p>
                </div>
                <Switch
                  id="biometrics"
                  checked={biometrics}
                  onCheckedChange={setBiometrics}
                />
              </div>
              
              <Separator />
              
              <Button variant="outline" className="w-full">
                <Shield className="h-4 w-4 mr-2" /> Change Password
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Data Management */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Data Management</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="offline" className="font-medium">
                    Offline Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Use app without internet connection
                  </p>
                </div>
                <Switch
                  id="offline"
                  checked={isOffline}
                  onCheckedChange={setIsOffline}
                />
              </div>
              
              <Separator />
              
              <Button variant="outline" className="w-full" onClick={handleExportData}>
                <Download className="h-4 w-4 mr-2" /> Export Your Data
              </Button>
              
              <Button variant="destructive" className="w-full" onClick={handleClearData}>
                <Trash2 className="h-4 w-4 mr-2" /> Clear All Data
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Account */}
        <Button variant="outline" className="w-full">
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
        
        <div className="text-center text-xs text-muted-foreground pt-4 pb-4">
          <p>FinTeal v1.0.0</p>
          <p>&copy; 2025 Lovable. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
