import type { StockInfo } from '../types';

// Generate mock price data for charts
const generateChartData = (basePrice: number, points: number = 30) => {
  const data = [];
  let currentPrice = basePrice;
  
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * (basePrice * 0.05); // ±5% variation
    currentPrice = Math.max(currentPrice + change, basePrice * 0.8); // Don't go below 80% of base
    
    const date = new Date();
    date.setHours(date.getHours() - (points - i));
    
    data.push({
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      price: currentPrice,
    });
  }
  
  return data;
};

// Mock stock data
export const mockStocks: StockInfo[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.84,
    change: 2.45,
    changePercent: 1.41,
    chartData: generateChartData(175.84),
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.56,
    change: -1.23,
    changePercent: -0.86,
    chartData: generateChartData(142.56),
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    change: 5.67,
    changePercent: 1.52,
    chartData: generateChartData(378.85),
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 248.42,
    change: -8.91,
    changePercent: -3.46,
    chartData: generateChartData(248.42),
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 155.89,
    change: 3.21,
    changePercent: 2.10,
    chartData: generateChartData(155.89),
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.30,
    change: 12.45,
    changePercent: 1.44,
    chartData: generateChartData(875.30),
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    price: 486.78,
    change: -4.56,
    changePercent: -0.93,
    chartData: generateChartData(486.78),
  },
  {
    symbol: 'NFLX',
    name: 'Netflix, Inc.',
    price: 647.35,
    change: 15.67,
    changePercent: 2.48,
    chartData: generateChartData(647.35),
  },
];

// Mock portfolio data
export const portfolioData = {
  totalValue: 12845.67,
  dayChange: 247.89,
  dayChangePercent: 1.97,
  chartData: generateChartData(12845.67, 100), // More data points for portfolio
};

// Mock watchlist
export const mockWatchlist = [
  'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'
];

// Time filter options
export const timeFilters = [
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' },
  { label: '3M', value: '3M' },
  { label: '1Y', value: '1Y' },
  { label: 'ALL', value: 'ALL' },
]; 