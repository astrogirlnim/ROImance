import React from 'react';
import StockChart from './StockChart';
import type { StockInfo } from '../types';

interface StockCardProps {
  stock: StockInfo;
  onClick?: () => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onClick }) => {
  const isPositive = stock.change >= 0;
  const chartColor = isPositive ? '#00d4aa' : '#ff6b6b';
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Married':
        return '#ffd700';
      case 'Engaged':
        return '#ff69b4';
      case 'Dating':
        return '#00d4aa';
      case 'Complicated':
        return '#ffa500';
      case 'Broken Up':
        return '#ff6b6b';
      default:
        return '#64748b';
    }
  };
  
  return (
    <div className="stock-card" onClick={onClick}>
      <div className="stock-header">
        <div>
          <div className="stock-symbol">{stock.symbol}</div>
          <div className="stock-name">{stock.couple}</div>
          {stock.relationshipStatus && (
            <div 
              className="relationship-status" 
              style={{ 
                color: getStatusColor(stock.relationshipStatus),
                fontSize: '12px',
                fontWeight: '500',
                marginTop: '4px'
              }}
            >
              {stock.relationshipStatus}
            </div>
          )}
        </div>
        <div className="stock-price">
          <div className="current-price">${stock.price.toFixed(2)}</div>
          <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}${stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </div>
          {stock.volume && (
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Vol: {(stock.volume / 1000000).toFixed(1)}M
            </div>
          )}
        </div>
      </div>
      
      <div className="mini-chart">
        <StockChart
          data={stock.chartData}
          symbol={stock.symbol}
          color={chartColor}
          showGrid={false}
        />
      </div>
    </div>
  );
};

export default StockCard; 