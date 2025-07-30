import React from 'react';
import { Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="header">
      <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: '600', 
        color: '#000000',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
        margin: 0,
        letterSpacing: '-0.02em',
        lineHeight: '1.1'
      }}>
        Good morning
      </h1>
      
      <div className="search-bar">
        <Search size={20} color="#64748b" />
        <input
          type="text"
          placeholder="Search relationships, couples, or symbols"
          className="search-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="user-profile">
        <Bell size={20} />
        <div style={{ 
          width: 'var(--spacing-9)', 
          height: 'var(--spacing-9)', 
          background: 'var(--flirt-surge)', 
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <User size={20} color="var(--flirt-surge-foreground)" />
        </div>
      </div>
    </div>
  );
};

export default Header; 