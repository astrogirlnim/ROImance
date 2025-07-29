# ROImance - Robinhood Clone

A modern, responsive stock trading interface built with React, TypeScript, and Chart.js that mimics the Robinhood trading app experience.

## Features

### 🎨 Modern Dark Theme UI
- Clean, professional dark theme inspired by Robinhood
- Responsive design that works on desktop and mobile
- Smooth animations and hover effects

### 📊 Interactive Charts
- Real-time-style stock price charts using Chart.js
- Portfolio performance visualization
- Multiple time frame filters (1D, 1W, 1M, 3M, 1Y, ALL)
- Mini charts for each stock card

### 🏠 Dashboard
- Portfolio summary with total value and daily changes
- Market overview with popular stocks
- Major market indices (S&P 500, NASDAQ, DOW JONES)
- Search functionality for stocks

### 📈 Stock Management
- Watchlist with customizable stock cards
- Real-time price updates (mock data)
- Percentage change indicators with color coding
- Individual stock charts

### 🧭 Navigation
- Sidebar navigation with multiple sections:
  - Dashboard
  - Stocks
  - Portfolio
  - Watchlist
  - Markets
  - Discover
  - Cards
  - Settings
- Account value display in sidebar

### 🔍 Search & Discovery
- Real-time search across stock symbols and company names
- Search results with stock cards and charts
- No results state with helpful messaging

## Technology Stack

- **Frontend**: React 19 with TypeScript
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Styling**: Pure CSS with custom variables

## Getting Started

### Prerequisites
- Node.js (v18.15.0 or higher)
- npm or yarn

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Top navigation with search
│   │   ├── Sidebar.tsx         # Left navigation sidebar
│   │   ├── StockChart.tsx      # Chart.js wrapper component
│   │   └── StockCard.tsx       # Individual stock display card
│   ├── utils/
│   │   └── mockData.ts         # Mock stock and portfolio data
│   ├── App.tsx                 # Main application component
│   ├── App.css                 # Global styles and theme
│   └── index.css               # Base CSS reset and variables
├── package.json
└── README.md
```

## Key Components

### StockChart
- Powered by Chart.js for smooth, interactive charts
- Configurable colors, grid display, and data points
- Responsive design that adapts to container size
- Custom tooltips with price formatting

### StockCard
- Displays stock symbol, company name, current price
- Shows daily change with color-coded indicators
- Includes mini chart for quick price trend visualization
- Clickable for detailed stock views

### Dashboard Layout
- Two-column grid layout (charts + watchlist)
- Portfolio summary with performance metrics
- Market overview with time filter controls
- Popular stocks grid below main content

## Mock Data

The app uses realistic mock data including:
- Popular stocks (AAPL, GOOGL, MSFT, TSLA, etc.)
- Historical price data with realistic fluctuations
- Portfolio performance metrics
- Market indices data

## Customization

### Adding New Stocks
Edit `src/utils/mockData.ts` to add new stocks to the `mockStocks` array:

```typescript
{
  symbol: 'SYMBOL',
  name: 'Company Name',
  price: 100.00,
  change: 2.50,
  changePercent: 2.56,
  chartData: generateChartData(100.00),
}
```

### Theming
The app uses CSS custom properties for theming. Main colors are defined in `App.css`:
- Primary: `#00d4aa` (green)
- Background: `#0d1421` (dark blue)
- Cards: `#1c2536` (lighter blue)
- Borders: `#2d3748` (gray)

### Chart Styling
Charts can be customized in the `StockChart` component by modifying the Chart.js options object.

## Future Enhancements

- [ ] Real-time data integration (WebSocket/API)
- [ ] User authentication and accounts
- [ ] Trading functionality (buy/sell orders)
- [ ] News feed integration
- [ ] Portfolio management tools
- [ ] Mobile app version
- [ ] Advanced charting tools
- [ ] Options trading interface

## License

This project is for educational purposes and demonstration of React/Chart.js capabilities.
