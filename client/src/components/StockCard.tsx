import React from 'react';
import StockChart from './StockChart';
import type { StockInfo } from '../types';

interface StockCardProps {
  stock: StockInfo;
  onClick?: () => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onClick }) => {
  const isPositive = stock.change >= 0;
  const chartColor = isPositive ? 'var(--flirt-surge)' : 'var(--heartline-red)';
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Married':
        return 'var(--risky-gold)';
      case 'Engaged':
        return 'var(--trust-blue)';
      case 'Dating':
        return 'var(--flirt-surge)';
      case 'Complicated':
        return 'var(--risky-gold)';
      case 'Broken Up':
        return 'var(--heartline-red)';
      default:
        return 'var(--gray-mutuals)';
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
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-medium)',
                marginTop: 'var(--spacing-1)',
                fontFamily: 'var(--font-sans)'
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
            <div style={{ 
              fontSize: 'var(--text-xs)', 
              color: 'var(--muted-foreground)', 
              marginTop: 'var(--spacing-0_5)',
              fontFamily: 'var(--font-sans)'
            }}>
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