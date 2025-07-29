export interface StockInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  chartData: Array<{ time: string; price: number }>;
}

export interface PortfolioData {
  totalValue: number;
  dayChange: number;
  dayChangePercent: number;
  chartData: Array<{ time: string; price: number }>;
}

export interface TimeFilter {
  label: string;
  value: string;
} 