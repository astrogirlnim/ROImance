import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

// Components
import Sidebar from './Sidebar';
import Header from './Header';
import StockChart from './StockChart';
import StockCard from './StockCard';

// Types and mock data
import type { StockInfo } from '../types';
import { mockStocks, portfolioData, mockWatchlist, timeFilters } from '../utils/mockData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('1D');

  const filteredStocks = mockStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.couple.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const watchlistStocks = mockStocks.filter(stock => 
    mockWatchlist.includes(stock.symbol)
  );

  const isPortfolioPositive = portfolioData.dayChange >= 0;

  const handleStockClick = (stock: StockInfo) => {
    navigate(`/relationship/${stock.symbol}`);
  };

  const handleNavItemClick = (item: string) => {
    setActiveNavItem(item);
    if (item === 'portfolio') {
      navigate('/portfolio');
    } else if (item === 'dashboard') {
      navigate('/');
    }
    // Add other navigation logic here as needed
  };

  return (
    <>
      <Sidebar 
        activeItem={activeNavItem} 
        onItemClick={handleNavItemClick} 
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
                <span className="portfolio-change-period">Today</span>
              </div>
              
              {/* Portfolio Chart */}
              <div className="portfolio-mini-chart">
                <StockChart
                  data={portfolioData.chartData}
                  symbol="Portfolio"
                  color={isPortfolioPositive ? 'var(--flirt-surge)' : 'var(--heartline-red)'}
                  showGrid={false}
                />
              </div>
            </div>

            {/* Main Chart */}
            <div className="chart-container chart-container-main">
              <div className="chart-header">
                <h2 className="chart-title">
                  {searchQuery ? `Search Results` : 'Relationship Market Overview'}
                </h2>
                <div className="time-filters">
                  {timeFilters.map(filter => (
                    <button
                      key={filter.value}
                      type="button"
                      className={`time-filter ${selectedTimeFilter === filter.value ? 'active' : ''}`}
                      onClick={() => setSelectedTimeFilter(filter.value)}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="chart-body">
                <StockChart
                  data={mockStocks[0].chartData}
                  symbol={mockStocks[0].symbol}
                  color="var(--flirt-surge)"
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
                  onClick={() => handleStockClick(stock)}
                />
              ))}
            </div>

            {searchQuery && filteredStocks.length === 0 && (
              <div className="no-results-message">
                <TrendingUp size={48} className="no-results-icon" />
                <p>No relationships found for "{searchQuery}"</p>
                <p className="no-results-hint">
                  Try searching for a different couple or symbol
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Popular Relationships Section */}
        {!searchQuery && (
          <div className="trending-section">
            <h2 className="section-title">
              Trending Relationships
            </h2>
            <div className="trending-grid">
              {mockStocks.slice(0, 6).map(stock => (
                <StockCard
                  key={stock.symbol}
                  stock={stock}
                  onClick={() => handleStockClick(stock)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Market Stats */}
        <div className="market-stats-grid">
          <div className="stock-card">
            <div className="market-stat-content">
              <div className="market-stat-label">
                Dating Market
              </div>
              <div className="market-stat-value">
                +12.5%
              </div>
              <div className="price-change positive market-stat-period">
                This Week
              </div>
            </div>
          </div>
          
          <div className="stock-card">
            <div className="market-stat-content">
              <div className="market-stat-label">
                Engagement Index
              </div>
              <div className="market-stat-value">
                +8.9%
              </div>
              <div className="price-change positive market-stat-period">
                This Month
              </div>
            </div>
          </div>
          
          <div className="stock-card">
            <div className="market-stat-content">
              <div className="market-stat-label">
                Breakup Index
              </div>
              <div className="market-stat-value">
                -3.2%
              </div>
              <div className="price-change negative market-stat-period">
                This Month
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
