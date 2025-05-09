
// Simulate AI responses for the AI Assistant feature
// In a real implementation, this would connect to a backend AI service

interface AIResponse {
  text: string;
  hasChart?: boolean;
}

export async function simulateAIResponse(userMessage: string): Promise<AIResponse> {
  // Convert message to lowercase for easier pattern matching
  const message = userMessage.toLowerCase();
  
  // Define patterns to match and their responses
  const responses: [RegExp, AIResponse][] = [
    // Questions about spending
    [
      /how much (did|have) i spend (on|in) (.*?) (last|this) (month|week)/i,
      {
        text: "Based on your transactions, you spent $320 on dining last month. That's about 15% of your total monthly spending.",
        hasChart: true
      }
    ],
    
    // Balance queries
    [
      /what('s| is) my (current )?balance/i,
      {
        text: "Your current account balance is $2,450.75. That's up $320.50 from last month."
      }
    ],
    
    // Goal progress
    [
      /how (am i|are we) doing on (my|our) (.*?) goal/i,
      {
        text: "You're making good progress on your vacation goal! You've saved $1,250 out of your $3,000 target (42%). At your current rate, you'll reach your goal in about 4 months."
      }
    ],
    
    // Budget status
    [
      /how('s| is) my budget( doing)?/i,
      {
        text: "You're staying within budget this month. You've used 68% of your monthly budget with 10 days remaining. Your grocery spending is slightly higher than usual, but you've spent less on entertainment."
      }
    ],
    
    // Expense analysis
    [
      /show me my (biggest|largest|highest|top) expenses/i,
      {
        text: "Your largest expenses this month are: 1) Rent: $1,200, 2) Groceries: $425, 3) Dining out: $320. Together these make up 65% of your monthly spending.",
        hasChart: true
      }
    ],
    
    // Savings advice
    [
      /how can i save (more money|money)/i,
      {
        text: "Based on your spending patterns, I see a few opportunities to save money: 1) Your subscription services total $65/month - consider reviewing which ones you actually use. 2) You've spent $320 on dining out this month - cooking at home more could save around $150."
      }
    ],
    
    // Income questions
    [
      /how much (did|have) i (earned|made|received|get)/i,
      {
        text: "You've received $3,250 in income this month from your primary job. That's consistent with your average monthly income over the past 6 months."
      }
    ]
  ];
  
  // Find matching response pattern
  for (const [pattern, response] of responses) {
    if (pattern.test(message)) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return response;
    }
  }
  
  // Default fallback responses if no pattern matches
  const fallbackResponses = [
    "I'm not sure I understand that question. Could you rephrase it?",
    "Based on your recent transactions, you've been spending most on groceries and dining out.",
    "Your financial health looks good overall. Your savings rate is approximately 15% of your income.",
    "Would you like me to analyze your spending patterns for the past month?",
    "I can help you set up a budget if you'd like. What are your main financial goals right now?"
  ];
  
  const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    text: randomResponse
  };
}
