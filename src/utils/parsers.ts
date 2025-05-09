
import { Transaction } from "../hooks/useDeviceFeatures";

export function parseMockExpenseFromText(text: string): Partial<Transaction> {
  // A simple parser to extract expense amount, category, etc. from text
  let amount = 0;
  let category = "Uncategorized";
  let description = text;
  
  // Try to find dollar amount pattern like $X, $X.XX, X dollars, etc.
  const dollarPattern = /\$\s*(\d+(\.\d{1,2})?)|(\d+(\.\d{1,2})?)(?:\s+dollars|\s+USD)/i;
  const dollarMatch = text.match(dollarPattern);
  
  if (dollarMatch) {
    amount = parseFloat(dollarMatch[1] || dollarMatch[3]);
  }
  
  // Try to identify category from common keywords
  const categoryMatches = {
    "Groceries": /groceries|grocery|supermarket|food shop|whole foods/i,
    "Dining": /restaurant|dinner|lunch|breakfast|coffee|cafe|dining/i,
    "Entertainment": /movie|cinema|theater|concert|entertainment/i,
    "Transportation": /transport|uber|lyft|taxi|bus|train|gas|fuel/i,
    "Utilities": /utility|electric|electricity|water|gas|bill|internet/i,
    "Shopping": /shopping|clothes|clothing|purchase|buy|bought|shoes|mall/i,
    "Healthcare": /health|doctor|medical|pharmacy|medicine|prescription/i,
    "Housing": /rent|mortgage|housing|apartment/i,
    "Salary": /salary|income|paycheck|earning|wage/i,
    "Investments": /investment|dividend|stock|bond|mutual fund|etf/i
  };
  
  for (const [cat, pattern] of Object.entries(categoryMatches)) {
    if (pattern.test(text)) {
      category = cat;
      break;
    }
  }
  
  // For a realistic implementation, we would use natural language processing
  // Here we're simulating the result
  
  return {
    amount,
    category,
    description,
    date: new Date().toISOString(),
    type: category === "Salary" || category === "Investments" ? "income" : "expense"
  };
}

export function parseMockReceiptData(): Partial<Transaction> {
  // Simulate receipt OCR extraction with randomized but realistic mock data
  const locations = [
    "Whole Foods Market",
    "Target",
    "Walmart",
    "Trader Joe's",
    "CVS Pharmacy",
    "Starbucks Coffee",
    "Amazon",
    "Apple Store",
    "Best Buy",
    "Home Depot"
  ];
  
  const categories = [
    "Groceries",
    "Shopping",
    "Dining",
    "Healthcare",
    "Entertainment"
  ];
  
  const randomAmount = Math.round((Math.random() * 150) + 5 + Math.random());
  const location = locations[Math.floor(Math.random() * locations.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  
  // Random date within last 5 days
  const daysAgo = Math.floor(Math.random() * 5);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  
  return {
    amount: randomAmount,
    location,
    category,
    description: `Purchase at ${location}`,
    date: date.toISOString(),
    type: "expense"
  };
}
