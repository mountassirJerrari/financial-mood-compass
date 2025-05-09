
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, BarChart3, PlusCircle, Target, User } from "lucide-react";

const NavigationBar: React.FC = () => {
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", icon: Home, label: "Home", path: "/" },
    { id: "transactions", icon: BarChart3, label: "Transactions", path: "/transactions" },
    { id: "add", icon: PlusCircle, label: "Add", path: "/add-expense" },
    { id: "goals", icon: Target, label: "Goals", path: "/goals" },
    { id: "profile", icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background p-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              }`
            }
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon
              className={`h-6 w-6 ${item.id === "add" ? "h-8 w-8 text-coral-DEFAULT" : ""}`}
            />
            <span className="text-xs mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default NavigationBar;
