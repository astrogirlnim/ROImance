import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, ArrowUp, ArrowDown, Heart, Users, Calendar, PieChart, DollarSign } from 'lucide-react';
import StockChart from './StockChart';
import { mockStocks, portfolioData } from '../utils/mockData';
import type { RelationshipStock, RelationshipEvent } from '../types';

const RelationshipView: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  
  const relationship = mockStocks.find(stock => stock.symbol === symbol);
  const userHolding = portfolioData.holdings.find(holding => holding.symbol === symbol);
  
  if (!relationship) {
    return (
      <div className="relationship-view">
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

  const isPositive = relationship.change >= 0;
  const hasPosition = !!userHolding;
  
  // Calculate additional portfolio metrics if user has a position
  const costBasis = hasPosition ? userHolding.value - userHolding.dayChange : 0;
  const totalReturn = hasPosition ? userHolding.value - costBasis : 0;
  const totalReturnPercent = hasPosition && costBasis > 0 ? (totalReturn / costBasis) * 100 : 0;
  const isPositionPositive = totalReturn >= 0;

  const getEventIcon = (type: RelationshipEvent['type']) => {
    switch (type) {
      case 'public_appearance':
        return <Users size={16} />;
      case 'social_media_post':
        return <Heart size={16} />;
      case 'engagement':
      case 'wedding':
        return <Heart size={16} style={{ color: '#ff69b4' }} />;
      default:
        return <Calendar size={16} />;
    }
  };

  const getEventColor = (impact: RelationshipEvent['impact']) => {
    switch (impact) {
      case 'positive':
        return '#00d4aa';
      case 'negative':
        return '#ff6b6b';
      default:
        return '#64748b';
    }
  };

  return (
    <div className="relationship-view">
      <button onClick={() => navigate('/')} className="back-button">
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <div className="relationship-main-content">
        {/* Left Column - 25% */}
        <div className="relationship-left-column">
          <div className="relationship-header">
            <div className="relationship-info">
              <h1 className="relationship-title">{relationship.couple}</h1>
              <div className="relationship-symbol">{relationship.symbol}</div>
              <div className="relationship-status-badge" data-status={relationship.relationshipStatus.toLowerCase().replace(' ', '-')}>
                {relationship.relationshipStatus}
              </div>
            </div>
            
            <div className="relationship-price">
              <div className="current-price">
                ${relationship.price.toFixed(2)}
              </div>
              <div className={`price-change ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {isPositive ? '+' : ''}${Math.abs(relationship.change).toFixed(2)} 
                ({isPositive ? '+' : ''}{relationship.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>

          {/* Portfolio Position Section */}
          {hasPosition && (
            <div className="portfolio-position-section">
              <div className="position-header">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontSize: '16px', fontWeight: '600' }}>
                  <PieChart size={18} style={{ color: '#00d4aa' }} />
                  Your Position
                </h3>
              </div>
              
              <div className="position-stats-grid">
                <div className="position-stat">
                  <div className="stat-label">Shares</div>
                  <div className="stat-value">{userHolding.shares}</div>
                </div>
                <div className="position-stat">
                  <div className="stat-label">Value</div>
                  <div className="stat-value">
                    ${(userHolding.value / 1000).toFixed(1)}k
                  </div>
                </div>
                <div className="position-stat">
                  <div className="stat-label">Today</div>
                  <div className={`stat-value ${userHolding.dayChange >= 0 ? 'positive' : 'negative'}`}>
                    {userHolding.dayChange >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    ${Math.abs(userHolding.dayChange).toFixed(0)}
                  </div>
                </div>
                <div className="position-stat">
                  <div className="stat-label">Return</div>
                  <div className={`stat-value ${isPositionPositive ? 'positive' : 'negative'}`}>
                    {isPositionPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    {totalReturnPercent.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="position-actions">
                <button 
                  className="portfolio-action-button primary compact"
                  onClick={() => navigate('/portfolio')}
                >
                  <DollarSign size={14} />
                  Portfolio
                </button>
                <button 
                  className="portfolio-action-button secondary compact"
                  onClick={() => navigate(`/trade/${symbol}`)}
                >
                  Trade
                </button>
              </div>
            </div>
          )}

          {/* No Position CTA */}
          {!hasPosition && (
            <div className="no-position-section compact">
              <div style={{ 
                background: '#1c2536', 
                border: '1px solid #2d3748', 
                borderRadius: '10px', 
                padding: '20px',
                textAlign: 'center',
                marginBottom: '20px'
              }}>
                <PieChart size={36} style={{ color: '#64748b', marginBottom: '12px' }} />
                <h3 style={{ color: '#ffffff', marginBottom: '6px', fontSize: '16px' }}>No position</h3>
                <p style={{ color: '#64748b', marginBottom: '16px', fontSize: '13px' }}>
                  Start investing in {relationship.couple}
                </p>
                <button 
                  className="portfolio-action-button primary compact"
                  onClick={() => navigate(`/trade/${symbol}`)}
                >
                  Buy {relationship.symbol}
                </button>
              </div>
            </div>
          )}

          {/* Stats Grid - Horizontal Layout */}
          <div className="relationship-stats-grid">
            <div className="stat-item">
              <div className="stat-label">Volume</div>
              <div className="stat-value">{(relationship.volume / 1000).toFixed(0)}k</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Market Cap</div>
              <div className="stat-value">${(relationship.price * relationship.volume / 1000000).toFixed(1)}M</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Events</div>
              <div className="stat-value">{relationship.events.length}</div>
            </div>
          </div>

          <div className="events-section compact">
            <h2>Recent Events</h2>
            {relationship.events.length > 0 ? (
              <div className="events-list">
                {relationship.events.slice(0, 4).map(event => (
                  <div key={event.id} className="event-item compact">
                    <div className="event-icon" style={{ color: getEventColor(event.impact) }}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="event-content">
                      <div className="event-description">{event.description}</div>
                      <div className="event-meta">
                        <span className="event-time">
                          {new Date(event.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        {event.priceImpact && (
                          <span className={`event-impact ${event.impact}`}>
                            {event.priceImpact > 0 ? '+' : ''}${event.priceImpact.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {relationship.events.length > 4 && (
                  <div className="show-more-events">
                    +{relationship.events.length - 4} more events
                  </div>
                )}
              </div>
            ) : (
              <div className="no-events">
                <TrendingUp size={36} style={{ color: '#64748b', marginBottom: '12px' }} />
                <p style={{ fontSize: '14px' }}>No recent events</p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>
                  Check back later for updates
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - 75% */}
        <div className="relationship-right-column">
          <div className="chart-section" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2>Price Chart</h2>
            <div style={{ flex: 1, marginTop: '20px', minHeight: '600px' }}>
              <StockChart
                data={relationship.chartData}
                symbol={relationship.symbol}
                color={isPositive ? '#00d4aa' : '#ff6b6b'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipView;
