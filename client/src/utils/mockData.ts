import type { StockInfo, RelationshipEvent } from '../types';

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

// Generate mock relationship events
const generateEvents = (symbol: string): RelationshipEvent[] => {
  const eventTemplates = {
    'TSWIFT-KELCE': [
      { type: 'public_appearance' as const, desc: 'Spotted at Chiefs game together', impact: 'positive' as const },
      { type: 'social_media_post' as const, desc: 'Instagram story featuring Travis', impact: 'positive' as const },
      { type: 'rumor' as const, desc: 'Engagement ring spotted by paparazzi', impact: 'positive' as const },
    ],
    'ARIANA-ETHAN': [
      { type: 'confirmation' as const, desc: 'Official relationship announcement', impact: 'positive' as const },
      { type: 'public_appearance' as const, desc: 'Red carpet debut at Tony Awards', impact: 'positive' as const },
    ],
    'SELENA-BENNY': [
      { type: 'public_appearance' as const, desc: 'Date night at Nobu Malibu', impact: 'positive' as const },
      { type: 'social_media_post' as const, desc: 'Benny posts romantic photo', impact: 'positive' as const },
    ],
  };

  const events = eventTemplates[symbol as keyof typeof eventTemplates] || [];
  return events.map((event, i) => ({
    id: `${symbol}-${i}`,
    timestamp: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
    type: event.type,
    description: event.desc,
    impact: event.impact,
    priceImpact: event.impact === 'positive' ? Math.random() * 5 + 1 : -(Math.random() * 3 + 1),
  }));
};

// Mock relationship stocks data
export const mockStocks: StockInfo[] = [
  {
    symbol: 'TSWIFT-KELCE',
    couple: 'Taylor Swift & Travis Kelce',
    price: 89.50,
    change: 12.45,
    changePercent: 16.14,
    volume: 2450000,
    relationshipStatus: 'Dating',
    chartData: generateChartData(89.50),
    events: generateEvents('TSWIFT-KELCE'),
  },
  {
    symbol: 'ARIANA-ETHAN',
    couple: 'Ariana Grande & Ethan Slater',
    price: 67.30,
    change: -3.20,
    changePercent: -4.54,
    volume: 1230000,
    relationshipStatus: 'Dating',
    chartData: generateChartData(67.30),
    events: generateEvents('ARIANA-ETHAN'),
  },
  {
    symbol: 'SELENA-BENNY',
    couple: 'Selena Gomez & Benny Blanco',
    price: 78.90,
    change: 5.67,
    changePercent: 7.74,
    volume: 1890000,
    relationshipStatus: 'Dating',
    chartData: generateChartData(78.90),
    events: generateEvents('SELENA-BENNY'),
  },
  {
    symbol: 'ZENDAYA-TOM',
    couple: 'Zendaya & Tom Holland',
    price: 95.20,
    change: 2.10,
    changePercent: 2.25,
    volume: 3100000,
    relationshipStatus: 'Dating',
    chartData: generateChartData(95.20),
    events: [],
  },
  {
    symbol: 'RYAN-BLAKE',
    couple: 'Ryan Reynolds & Blake Lively',
    price: 142.80,
    change: 1.50,
    changePercent: 1.06,
    volume: 980000,
    relationshipStatus: 'Married',
    chartData: generateChartData(142.80),
    events: [],
  },
  {
    symbol: 'PRIYANKA-NICK',
    couple: 'Priyanka Chopra & Nick Jonas',
    price: 128.45,
    change: -0.85,
    changePercent: -0.66,
    volume: 750000,
    relationshipStatus: 'Married',
    chartData: generateChartData(128.45),
    events: [],
  },
  {
    symbol: 'BEYONCE-JAY',
    couple: 'Beyoncé & Jay-Z',
    price: 186.75,
    change: 3.20,
    changePercent: 1.74,
    volume: 1200000,
    relationshipStatus: 'Married',
    chartData: generateChartData(186.75),
    events: [],
  },
  {
    symbol: 'KIM-PETE',
    couple: 'Kim Kardashian & Pete Davidson',
    price: 12.30,
    change: -45.20,
    changePercent: -78.64,
    volume: 5600000,
    relationshipStatus: 'Broken Up',
    chartData: generateChartData(12.30),
    events: [],
  },
];

// Mock portfolio data
export const portfolioData = {
  totalValue: 12845.67,
  dayChange: 247.89,
  dayChangePercent: 1.97,
  chartData: generateChartData(12845.67, 100), // More data points for portfolio
  holdings: [
    { symbol: 'TSWIFT-KELCE', shares: 50, value: 4475.00, dayChange: 622.50 },
    { symbol: 'ZENDAYA-TOM', shares: 30, value: 2856.00, dayChange: 63.00 },
    { symbol: 'BEYONCE-JAY', shares: 20, value: 3735.00, dayChange: 64.00 },
    { symbol: 'SELENA-BENNY', shares: 40, value: 3156.00, dayChange: 226.80 },
    { symbol: 'RYAN-BLAKE', shares: 10, value: 1428.00, dayChange: 15.00 },
  ],
};

// Mock watchlist
export const mockWatchlist = [
  'TSWIFT-KELCE', 'ZENDAYA-TOM', 'BEYONCE-JAY', 'SELENA-BENNY', 'RYAN-BLAKE'
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