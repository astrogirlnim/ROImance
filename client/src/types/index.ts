export interface RelationshipStock {
  symbol: string;
  couple: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  relationshipStatus: 'Dating' | 'Engaged' | 'Married' | 'Complicated' | 'Broken Up';
  chartData: Array<{ time: string; price: number }>;
  events: RelationshipEvent[];
}

export interface RelationshipEvent {
  id: string;
  timestamp: string;
  type: 'public_appearance' | 'social_media_post' | 'rumor' | 'confirmation' | 'breakup_rumor' | 'engagement' | 'wedding';
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  priceImpact?: number;
}

export interface PortfolioData {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  chartData: Array<{ time: string; price: number }>;
  holdings: Array<{
    symbol: string;
    shares: number;
    value: number;
    dayChange: number;
  }>;
}

export interface TimeFilter {
  label: string;
  value: string;
}

// For backward compatibility during refactor
export interface StockInfo extends RelationshipStock {} 