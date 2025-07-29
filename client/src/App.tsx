import React, { useState } from 'react';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import './App.css';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StockChart from './components/StockChart';
import StockCard from './components/StockCard';

// Types and mock data
import type { StockInfo } from './types';
import { mockStocks, portfolioData, mockWatchlist, timeFilters } from './utils/mockData';

function App() {
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('1D');

  const filteredStocks = mockStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const watchlistStocks = mockStocks.filter(stock => 
    mockWatchlist.includes(stock.symbol)
  );

  const isPortfolioPositive = portfolioData.dayChange >= 0;

  return (
    <div className="app">
      <Sidebar 
        activeItem={activeNavItem} 
        onItemClick={setActiveNavItem} 
      />
      
      <div className="main-content">
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <div className="dashboard">
          {/* Left Column - Charts and Portfolio */}
          <div>
            {/* Portfolio Summary */}
            <div className="portfolio-summary">
              <div className="portfolio-value">
                ${portfolioData.totalValue.toLocaleString('en-US', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </div>
              <div className={`portfolio-change ${isPortfolioPositive ? 'positive' : 'negative'}`}>
                {isPortfolioPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {isPortfolioPositive ? '+' : ''}${Math.abs(portfolioData.dayChange).toFixed(2)} 
                ({isPortfolioPositive ? '+' : ''}{portfolioData.dayChangePercent.toFixed(2)}%)
                <span style={{ color: '#64748b', marginLeft: '8px' }}>Today</span>
              </div>
              
              {/* Portfolio Chart */}
              <div style={{ height: '200px', marginTop: '16px' }}>
                <StockChart
                  data={portfolioData.chartData}
                  symbol="Portfolio"
                  color={isPortfolioPositive ? '#00d4aa' : '#ff6b6b'}
                  showGrid={false}
                />
              </div>
            </div>

            {/* Main Chart */}
            <div className="chart-container" style={{ marginTop: '24px' }}>
              <div className="chart-header">
                <h2 className="chart-title">
                  {searchQuery ? `Search Results` : 'Market Overview'}
                </h2>
                <div className="time-filters">
                  {timeFilters.map(filter => (
                    <button
                      key={filter.value}
                      className={`time-filter ${selectedTimeFilter === filter.value ? 'active' : ''}`}
                      onClick={() => setSelectedTimeFilter(filter.value)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ height: 'calc(100% - 60px)' }}>
                <StockChart
                  data={mockStocks[0].chartData}
                  symbol={mockStocks[0].symbol}
                  color="#00d4aa"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Watchlist */}
          <div className="watchlist">
            <h2 className="section-title">
              {searchQuery ? `Search Results (${filteredStocks.length})` : 'Watchlist'}
            </h2>
            
            <div className="stock-list">
              {(searchQuery ? filteredStocks : watchlistStocks).map(stock => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onClick={() => console.log(`Clicked ${stock.symbol}`)}
                />
              ))}
            </div>

            {searchQuery && filteredStocks.length === 0 && (
              <div style={{ 
                textAlign: 'center',
                color: '#64748b',
                padding: '40px 20px'
              }}>
                <TrendingUp size={48} style={{ marginBottom: '16px' }} />
                <p>No stocks found for "{searchQuery}"</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                  Try searching for a different symbol or company name
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Popular Stocks Section */}
        {!searchQuery && (
          <div style={{ marginTop: '32px' }}>
            <h2 className="section-title" style={{ marginBottom: '20px' }}>
              Popular Stocks
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {mockStocks.slice(0, 6).map(stock => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onClick={() => console.log(`Clicked ${stock.symbol}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Market Stats */}
        <div style={{ 
          marginTop: '32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div className="stock-card">
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
                S&P 500
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>
                4,783.45
              </div>
              <div className="price-change positive" style={{ fontSize: '14px' }}>
                +23.67 (+0.50%)
              </div>
            </div>
          </div>
          
          <div className="stock-card">
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
                NASDAQ
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>
                15,832.80
              </div>
              <div className="price-change positive" style={{ fontSize: '14px' }}>
                +89.23 (+0.57%)
              </div>
            </div>
          </div>
          
          <div className="stock-card">
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
                DOW JONES
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>
                38,467.91
              </div>
              <div className="price-change negative" style={{ fontSize: '14px' }}>
                -45.78 (-0.12%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
