// AI Transaction Categorization Service
// Categorizes transactions based on keywords and patterns

interface CategoryMatch {
  category: string;
  keywords: string[];
  patterns: RegExp[];
}

const categoryRules: CategoryMatch[] = [
  {
    category: 'food',
    keywords: ['restaurant', 'cafe', 'coffee', 'pizza', 'burger', 'food', 'grocery', 'supermarket', 'meal', 'lunch', 'dinner', 'breakfast', 'starbucks', 'mcdonalds', 'subway', 'doordash', 'uber eats'],
    patterns: [/restaurant/i, /cafe/i, /coffee/i, /pizza/i, /burger/i, /grocery/i, /supermarket/i]
  },
  {
    category: 'bills',
    keywords: ['electric', 'water', 'gas', 'internet', 'phone', 'mobile', 'utility', 'rent', 'insurance', 'subscription', 'netflix', 'spotify', 'electricity', 'wifi'],
    patterns: [/electric/i, /water/i, /gas/i, /internet/i, /phone/i, /mobile/i, /utility/i, /rent/i, /insurance/i]
  },
  {
    category: 'travel',
    keywords: ['flight', 'hotel', 'airbnb', 'uber', 'lyft', 'taxi', 'gas station', 'fuel', 'airport', 'airline', 'travel', 'trip', 'vacation', 'booking', 'expedia'],
    patterns: [/flight/i, /hotel/i, /airbnb/i, /uber/i, /lyft/i, /taxi/i, /fuel/i, /airport/i, /travel/i, /trip/i]
  },
  {
    category: 'shopping',
    keywords: ['amazon', 'ebay', 'walmart', 'target', 'best buy', 'store', 'mall', 'shop', 'purchase', 'clothing', 'fashion', 'shoes', 'electronics', 'gadget'],
    patterns: [/amazon/i, /ebay/i, /walmart/i, /target/i, /shop/i, /store/i, /mall/i, /purchase/i]
  },
  {
    category: 'entertainment',
    keywords: ['movie', 'cinema', 'theater', 'concert', 'game', 'spotify', 'netflix', 'hulu', 'disney', 'youtube', 'entertainment', 'music', 'streaming'],
    patterns: [/movie/i, /cinema/i, /theater/i, /concert/i, /game/i, /spotify/i, /netflix/i, /hulu/i, /disney/i, /youtube/i]
  },
  {
    category: 'health',
    keywords: ['pharmacy', 'doctor', 'hospital', 'medical', 'health', 'medicine', 'drug', 'clinic', 'fitness', 'gym', 'wellness'],
    patterns: [/pharmacy/i, /doctor/i, /hospital/i, /medical/i, /health/i, /medicine/i, /clinic/i, /gym/i]
  },
  {
    category: 'education',
    keywords: ['school', 'university', 'college', 'course', 'book', 'tuition', 'education', 'learning', 'udemy', 'coursera', 'skillshare'],
    patterns: [/school/i, /university/i, /college/i, /course/i, /tuition/i, /education/i, /learning/i]
  },
  {
    category: 'transfer',
    keywords: ['transfer', 'send', 'receive', 'payment', 'pay', 'remittance'],
    patterns: [/transfer/i, /send/i, /receive/i, /payment/i]
  }
];

export function categorizeTransaction(description: string): string {
  if (!description) return 'other';
  
  const lowerDesc = description.toLowerCase();
  
  // Check keyword matches
  for (const rule of categoryRules) {
    for (const keyword of rule.keywords) {
      if (lowerDesc.includes(keyword.toLowerCase())) {
        return rule.category;
      }
    }
    
    // Check pattern matches
    for (const pattern of rule.patterns) {
      if (pattern.test(description)) {
        return rule.category;
      }
    }
  }
  
  return 'other';
}

export function autoCategorizeTransactions(descriptions: string[]): string[] {
  return descriptions.map(desc => categorizeTransaction(desc));
}

// Fraud Detection Logic
export interface FraudDetectionResult {
  isSuspicious: boolean;
  reason?: string;
  riskScore: number; // 0-100
}

export function detectFraud(
  amount: number,
  senderAvgAmount: number,
  isNewRecipient: boolean,
  senderTransactionHistory: number[]
): FraudDetectionResult {
  let riskScore = 0;
  const reasons: string[] = [];
  
  // Check if amount is significantly higher than average
  if (senderAvgAmount > 0) {
    const ratio = amount / senderAvgAmount;
    if (ratio > 5) {
      riskScore += 50;
      reasons.push(`Amount is ${ratio.toFixed(1)}x your average transaction`);
    } else if (ratio > 3) {
      riskScore += 30;
      reasons.push(`Amount is ${ratio.toFixed(1)}x your average transaction`);
    } else if (ratio > 2) {
      riskScore += 15;
      reasons.push(`Amount is ${ratio.toFixed(1)}x your average transaction`);
    }
  }
  
  // Check if recipient is new
  if (isNewRecipient) {
    riskScore += 20;
    reasons.push('New recipient');
  }
  
  // Check for unusual frequency (multiple large transactions in short time)
  if (senderTransactionHistory.length > 5) {
    const recentLargeTransactions = senderTransactionHistory.filter(a => a > senderAvgAmount * 2).length;
    if (recentLargeTransactions >= 3) {
      riskScore += 25;
      reasons.push('Multiple large transactions recently');
    }
  }
  
  // Check for round amounts (often used in scams)
  if (amount >= 1000 && amount % 100 === 0) {
    riskScore += 10;
    reasons.push('Round amount (potential scam pattern)');
  }
  
  return {
    isSuspicious: riskScore >= 50,
    reason: riskScore >= 50 ? reasons.join(', ') : undefined,
    riskScore: Math.min(riskScore, 100)
  };
}
