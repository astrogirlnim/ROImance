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

  return (
    <>
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
                  {searchQuery ? `Search Results` : 'Relationship Market Overview'}
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
                  onClick={() => handleStockClick(stock)}
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
                <p>No relationships found for "{searchQuery}"</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                  Try searching for a different couple or symbol
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Popular Relationships Section */}
        {!searchQuery && (
          <div style={{ marginTop: '32px' }}>
            <h2 className="section-title" style={{ marginBottom: '20px' }}>
              Trending Relationships
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
                  onClick={() => handleStockClick(stock)}
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
                Dating Market
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>
                +12.5%
              </div>
              <div className="price-change positive" style={{ fontSize: '14px' }}>
                This Week
              </div>
            </div>
          </div>
          
          <div className="stock-card">
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
                Engagement Index
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>
                +8.9%
              </div>
              <div className="price-change positive" style={{ fontSize: '14px' }}>
                This Month
              </div>
            </div>
          </div>
          
          <div className="stock-card">
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>
                Breakup Index
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', marginBottom: '4px' }}>
                -3.2%
              </div>
              <div className="price-change negative" style={{ fontSize: '14px' }}>
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
