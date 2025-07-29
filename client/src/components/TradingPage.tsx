import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, ArrowUp, ArrowDown, DollarSign, Share, Calculator } from 'lucide-react';
import { mockStocks, portfolioData } from '../utils/mockData';

const TradingPage: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [shares, setShares] = useState<string>('');
  const [orderMode, setOrderMode] = useState<'market' | 'limit'>('market');
  const [limitPrice, setLimitPrice] = useState<string>('');

  const relationship = mockStocks.find(stock => stock.symbol === symbol);
  const userHolding = portfolioData.holdings.find(holding => holding.symbol === symbol);

  if (!relationship) {
    return (
      <div className="trading-page">
        <button onClick={() => navigate('/')} className="back-button">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>
          Relationship not found
        </div>
      </div>
    );
  }

  const currentPrice = relationship.price;
  const sharesNum = parseFloat(shares) || 0;
  const orderValue = sharesNum * (orderMode === 'limit' && limitPrice ? parseFloat(limitPrice) : currentPrice);
  const maxShares = userHolding?.shares || 0;
  const isPositive = relationship.change >= 0;

  const handleOrderSubmit = () => {
    // Mock order submission - in real app would call API
    alert(`${orderType.toUpperCase()} order submitted: ${shares} shares of ${symbol} ${orderMode === 'limit' ? `at $${limitPrice}` : 'at market price'}`);
    navigate(`/relationship/${symbol}`);
  };

  const isOrderValid = () => {
    if (!shares || sharesNum <= 0) return false;
    if (orderType === 'sell' && sharesNum > maxShares) return false;
    if (orderMode === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0)) return false;
    return true;
  };

  return (
    <div className="trading-page">
      <button onClick={() => navigate(`/relationship/${symbol}`)} className="back-button">
        <ArrowLeft size={20} />
        Back to {relationship.couple}
      </button>

      <div className="trading-header">
        <div className="stock-info">
          <h1 className="trading-title">Trade {relationship.couple}</h1>
          <div className="trading-symbol">{relationship.symbol}</div>
          <div className="current-price-section">
            <div className="price-label">Current Price</div>
            <div className="current-price">${currentPrice.toFixed(2)}</div>
            <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
              {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              {isPositive ? '+' : ''}${Math.abs(relationship.change).toFixed(2)} 
              ({isPositive ? '+' : ''}{relationship.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Position Summary */}
      {userHolding && (
        <div className="position-summary">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', marginBottom: '16px' }}>
            <Share size={20} style={{ color: '#00d4aa' }} />
            Current Position
          </h3>
          <div className="position-grid">
            <div className="position-item">
              <div className="label">Shares</div>
              <div className="value">{userHolding.shares}</div>
            </div>
            <div className="position-item">
              <div className="label">Market Value</div>
              <div className="value">${userHolding.value.toLocaleString()}</div>
            </div>
            <div className="position-item">
              <div className="label">Avg Cost</div>
              <div className="value">${((userHolding.value - userHolding.dayChange) / userHolding.shares).toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Trading Form */}
      <div className="trading-form">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', marginBottom: '24px' }}>
          <DollarSign size={20} style={{ color: '#00d4aa' }} />
          Place Order
        </h3>

        {/* Order Type Toggle */}
        <div className="order-type-selector">
          <button 
            className={`order-type-btn ${orderType === 'buy' ? 'active buy' : ''}`}
            onClick={() => setOrderType('buy')}
          >
            Buy
          </button>
          <button 
            className={`order-type-btn ${orderType === 'sell' ? 'active sell' : ''}`}
            onClick={() => setOrderType('sell')}
            disabled={!userHolding}
          >
            Sell
          </button>
        </div>

        {/* Order Mode Toggle */}
        <div className="order-mode-selector">
          <button 
            className={`order-mode-btn ${orderMode === 'market' ? 'active' : ''}`}
            onClick={() => setOrderMode('market')}
          >
            Market Order
          </button>
          <button 
            className={`order-mode-btn ${orderMode === 'limit' ? 'active' : ''}`}
            onClick={() => setOrderMode('limit')}
          >
            Limit Order
          </button>
        </div>

        {/* Shares Input */}
        <div className="input-group">
          <label className="input-label">Number of Shares</label>
          <input
            type="number"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            placeholder="0"
            className="trading-input"
            min="0"
            max={orderType === 'sell' ? maxShares : undefined}
          />
          {orderType === 'sell' && userHolding && (
            <div className="input-helper">
              Max: {maxShares} shares available
              <button 
                className="max-btn"
                onClick={() => setShares(maxShares.toString())}
              >
                Max
              </button>
            </div>
          )}
        </div>

        {/* Limit Price Input */}
        {orderMode === 'limit' && (
          <div className="input-group">
            <label className="input-label">Limit Price</label>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(e.target.value)}
              placeholder={currentPrice.toFixed(2)}
              className="trading-input"
              min="0"
              step="0.01"
            />
            <div className="input-helper">
              Current market price: ${currentPrice.toFixed(2)}
            </div>
          </div>
        )}

        {/* Order Summary */}
        {sharesNum > 0 && (
          <div className="order-summary">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', marginBottom: '12px' }}>
              <Calculator size={16} style={{ color: '#00d4aa' }} />
              Order Summary
            </h4>
            <div className="summary-grid">
              <div className="summary-item">
                <span>Shares:</span>
                <span>{sharesNum}</span>
              </div>
              <div className="summary-item">
                <span>Price:</span>
                <span>${(orderMode === 'limit' && limitPrice ? parseFloat(limitPrice) : currentPrice).toFixed(2)}</span>
              </div>
              <div className="summary-item total">
                <span>Total {orderType === 'buy' ? 'Cost' : 'Proceeds'}:</span>
                <span>${orderValue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button 
          className={`submit-order-btn ${orderType} ${!isOrderValid() ? 'disabled' : ''}`}
          onClick={handleOrderSubmit}
          disabled={!isOrderValid()}
        >
          {orderType === 'buy' ? 'Buy' : 'Sell'} {relationship.symbol}
        </button>

        {/* Validation Messages */}
        {!isOrderValid() && shares && (
          <div className="validation-message">
            {!shares || sharesNum <= 0 ? 'Please enter a valid number of shares' :
             orderType === 'sell' && sharesNum > maxShares ? `You only own ${maxShares} shares` :
             orderMode === 'limit' && (!limitPrice || parseFloat(limitPrice) <= 0) ? 'Please enter a valid limit price' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingPage;
