import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, ArrowUp, ArrowDown, Heart, Users, Calendar, PieChart, DollarSign } from 'lucide-react';
import StockChart from './StockChart';
import { mockStocks, portfolioData } from '../utils/mockData';
import type { RelationshipEvent } from '../types';

const RelationshipView: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  
  const relationship = mockStocks.find(stock => stock.symbol === symbol);
  const userHolding = portfolioData.holdings.find(holding => holding.symbol === symbol);
  
  if (!relationship) {
    return (
      <div className="relationship-view">
        <button type="button" onClick={() => navigate('/')} className="back-button">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <div className="relationship-not-found">
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
        return <Heart size={16} style={{ color: 'var(--heartline-red)' }} />;
      default:
        return <Calendar size={16} />;
    }
  };

  const getEventColor = (impact: RelationshipEvent['impact']) => {
    switch (impact) {
      case 'positive':
        return 'var(--flirt-surge)';
      case 'negative':
        return 'var(--heartline-red)';
      default:
        return 'var(--gray-mutuals)';
    }
  };

  return (
    <div className="relationship-view-container">
      {/* Left Column - 25% width */}
      <div className="relationship-left-column">
        <button type="button" onClick={() => navigate('/')} className="back-button">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

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
              <h3 className="position-header-title">
                <PieChart size={20} className="position-icon" />
                Your Position
              </h3>
            </div>
            
            <div className="position-stats-grid">
              <div className="position-stat">
                <div className="stat-label">Shares Owned</div>
                <div className="stat-value">{userHolding.shares}</div>
              </div>
              <div className="position-stat">
                <div className="stat-label">Market Value</div>
                <div className="stat-value">
                  ${userHolding.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="position-stat">
                <div className="stat-label">Today's Change</div>
                <div className={`stat-value ${userHolding.dayChange >= 0 ? 'positive' : 'negative'}`}>
                  {userHolding.dayChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  {userHolding.dayChange >= 0 ? '+' : ''}${Math.abs(userHolding.dayChange).toFixed(2)}
                </div>
              </div>
              <div className="position-stat">
                <div className="stat-label">Total Return</div>
                <div className={`stat-value ${isPositionPositive ? 'positive' : 'negative'}`}>
                  {isPositionPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                  {isPositionPositive ? '+' : ''}${Math.abs(totalReturn).toFixed(2)} ({isPositionPositive ? '+' : ''}{totalReturnPercent.toFixed(2)}%)
                </div>
              </div>
            </div>
            
            <div className="position-actions">
              <button 
                type="button"
                className="portfolio-action-button primary"
                onClick={() => navigate('/portfolio')}
              >
                <DollarSign size={16} />
                View Full Portfolio
              </button>
              <button 
                type="button"
                className="portfolio-action-button secondary"
                onClick={() => navigate(`/trade/${symbol}`)}
              >
                Trade Position
              </button>
            </div>
          </div>
        )}

        {/* No Position CTA */}
        {!hasPosition && (
          <div className="no-position-section">
            <div style={{ 
              background: 'var(--card)', 
              border: '1px solid var(--border)', 
              borderRadius: '12px', 
              padding: '24px',
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              <PieChart size={48} style={{ color: 'var(--muted-foreground)', marginBottom: '16px' }} />
              <h3 style={{ color: 'var(--foreground)', marginBottom: '8px' }}>You don't own this stock</h3>
              <p style={{ color: 'var(--muted-foreground)', marginBottom: '20px', fontSize: '14px' }}>
                Start investing in {relationship.couple} to track your position here
              </p>

              <button 
                type="button"
                className="portfolio-action-button primary"
                onClick={() => navigate(`/trade/${symbol}`)}
              >
                Buy {relationship.symbol}
              </button>
            </div>
          </div>
        )}

        <div className="relationship-stats">
          <div className="stat-item">
            <div className="stat-label">Volume</div>
            <div className="stat-value">{relationship.volume.toLocaleString()}</div>
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

        <div className="events-section">
          <h2>Recent Events</h2>
          {relationship.events.length > 0 ? (
            <div className="events-list">
              {relationship.events.map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-icon" style={{ color: getEventColor(event.impact) }}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="event-content">
                    <div className="event-description">{event.description}</div>
                    <div className="event-meta">
                      <span className="event-time">
                        {new Date(event.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
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
            </div>
          ) : (
            <div className="no-events">
              <TrendingUp size={48} style={{ color: 'var(--muted-foreground)', marginBottom: '16px' }} />
              <p>No recent events</p>
              <p style={{ fontSize: '14px', color: 'var(--muted-foreground)' }}>
                Check back later for relationship updates
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - 75% width */}
      <div className="relationship-right-column">
        <div className="chart-section-fullscreen">
          <h2>Price Chart</h2>
          <div className="chart-container-fullscreen">
            <StockChart
              data={relationship.chartData}
              symbol={relationship.symbol}
              color={isPositive ? 'var(--flirt-surge)' : 'var(--heartline-red)'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelationshipView;
