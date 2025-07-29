import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, ArrowUp, ArrowDown, Heart, Users, Calendar } from 'lucide-react';
import StockChart from './StockChart';
import { mockStocks } from '../utils/mockData';
import type { RelationshipStock, RelationshipEvent } from '../types';

const RelationshipView: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  
  const relationship = mockStocks.find(stock => stock.symbol === symbol);
  
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

      <div className="relationship-content">
        <div className="chart-section">
          <h2>Price Chart</h2>
          <div style={{ height: '400px', marginTop: '20px' }}>
            <StockChart
              data={relationship.chartData}
              symbol={relationship.symbol}
              color={isPositive ? '#00d4aa' : '#ff6b6b'}
            />
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
              <TrendingUp size={48} style={{ color: '#64748b', marginBottom: '16px' }} />
              <p>No recent events</p>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                Check back later for relationship updates
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelationshipView;
