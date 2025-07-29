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
  
  return (
    <div className="stock-card" onClick={onClick}>
      <div className="stock-header">
        <div>
          <div className="stock-symbol">{stock.symbol}</div>
          <div className="stock-name">{stock.name}</div>
        </div>
        <div className="stock-price">
          <div className="current-price">${stock.price.toFixed(2)}</div>
          <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? '+' : ''}${stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
          </div>
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