
import React from "react";
import {
  ShoppingBag,
  Coffee,
  Film,
  Bus,
  Home,
  Lightbulb,
  Heart,
  Building,
  Briefcase,
  BarChart3
} from "lucide-react";

interface CategorySelectorProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const categories = [
    { id: "Shopping", icon: ShoppingBag, color: "#E76F51" },
    { id: "Dining", icon: Coffee, color: "#F4A261" },
    { id: "Entertainment", icon: Film, color: "#E9C46A" },
    { id: "Transportation", icon: Bus, color: "#2A9D8F" },
    { id: "Housing", icon: Home, color: "#264653" },
    { id: "Utilities", icon: Lightbulb, color: "#606C38" },
    { id: "Healthcare", icon: Heart, color: "#BC6C25" },
    { id: "Business", icon: Building, color: "#6B705C" },
    { id: "Salary", icon: Briefcase, color: "#4CAF50" },
    { id: "Investments", icon: BarChart3, color: "#1E88E5" }
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          className={`category-tile ${
            selectedCategory === category.id
              ? "ring-2 ring-primary ring-offset-2"
              : ""
          }`}
          onClick={() => onSelectCategory(category.id)}
          style={{ backgroundColor: `${category.color}20` }}
        >
          <category.icon
            className="h-5 w-5 mb-1"
            style={{ color: category.color }}
          />
          <span className="text-xs">{category.id}</span>
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
