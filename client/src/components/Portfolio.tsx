import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, ArrowUp, ArrowDown, PieChart } from 'lucide-react';

// Components
import Sidebar from './Sidebar';
import Header from './Header';
import StockChart from './StockChart';

// Types and mock data
import { portfolioData, mockStocks, timeFilters } from '../utils/mockData';

const Portfolio: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('1D');

  const isPortfolioPositive = portfolioData.dayChange >= 0;

  const handleStockClick = (symbol: string) => {
    navigate(`/relationship/${symbol}`);
  };

  const getStockDetails = (symbol: string) => {
    return mockStocks.find(stock => stock.symbol === symbol);
  };

  return (
    <>
      <Sidebar 
        activeItem="portfolio" 
        onItemClick={(item) => {
          if (item === 'dashboard') navigate('/');
          else if (item === 'portfolio') navigate('/portfolio');
        }} 
      />
      
      <div className="main-content">
        <Header 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <div className="portfolio-page">
          <div className="portfolio-header">
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: '#ffffff',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <PieChart size={32} style={{ color: '#00d4aa' }} />
              My Portfolio
            </h1>
            <p style={{ 
              color: '#64748b', 
              fontSize: '16px',
              marginBottom: '32px'
            }}>
              Track your relationship stock investments and daily performance
            </p>
          </div>

          {/* Portfolio Summary */}
          <div className="portfolio-overview">
            <div className="portfolio-value-card">
              <div className="portfolio-value">
                ${portfolioData.totalValue.toLocaleString('en-US', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </div>
              <div className={`portfolio-change ${isPortfolioPositive ? 'positive' : 'negative'}`}>
                {isPortfolioPositive ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                {isPortfolioPositive ? '+' : ''}${Math.abs(portfolioData.dayChange).toFixed(2)} 
                ({isPortfolioPositive ? '+' : ''}{portfolioData.dayChangePercent.toFixed(2)}%)
                <span style={{ color: '#64748b', marginLeft: '12px' }}>Today</span>
              </div>
            </div>

            <div className="portfolio-stats">
              <div className="stat-item">
                <div className="stat-label">Total Holdings</div>
                <div className="stat-value">{portfolioData.holdings.length}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Best Performer</div>
                <div className="stat-value" style={{ color: '#00d4aa' }}>
                  {portfolioData.holdings.reduce((best, current) => 
                    current.dayChange > best.dayChange ? current : best
                  ).symbol}
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Market Value</div>
                <div className="stat-value">
                  ${portfolioData.holdings.reduce((total, holding) => total + holding.value, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Chart */}
          <div className="portfolio-chart-container">
            <div className="chart-header">
              <h2 className="chart-title">Portfolio Performance</h2>
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
            
            <div style={{ height: '400px', marginTop: '20px' }}>
              <StockChart
                data={portfolioData.chartData}
                symbol="Portfolio"
                color={isPortfolioPositive ? '#00d4aa' : '#ff6b6b'}
              />
            </div>
          </div>

          {/* Holdings Table */}
          <div className="holdings-section">
            <h2 className="section-title">Your Holdings</h2>
            <div className="holdings-table">
              <div className="holdings-header">
                <div>Relationship</div>
                <div>Shares</div>
                <div>Current Price</div>
                <div>Market Value</div>
                <div>Day Change</div>
                <div>Actions</div>
              </div>
              {portfolioData.holdings.map(holding => {
                const stockDetails = getStockDetails(holding.symbol);
                const isDayChangePositive = holding.dayChange >= 0;
                
                return (
                  <div key={holding.symbol} className="holding-row">
                    <div className="holding-stock">
                      <div className="stock-symbol">{holding.symbol}</div>
                      <div className="stock-name">{stockDetails?.couple || 'Unknown'}</div>
                    </div>
                    <div className="holding-shares">{holding.shares}</div>
                    <div className="holding-price">
                      ${stockDetails?.price.toFixed(2) || '0.00'}
                    </div>
                    <div className="holding-value">
                      ${holding.value.toLocaleString('en-US', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                      })}
                    </div>
                    <div className={`holding-change ${isDayChangePositive ? 'positive' : 'negative'}`}>
                      {isDayChangePositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      {isDayChangePositive ? '+' : ''}${Math.abs(holding.dayChange).toFixed(2)}
                    </div>
                    <div className="holding-actions">
                      <button 
                        className="view-button"
                        onClick={() => handleStockClick(holding.symbol)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Portfolio; 