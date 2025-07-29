import React from 'react';
import { Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="header">
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff' }}>
        Good morning
      </h1>
      
      <div className="search-bar">
        <Search size={20} color="#64748b" />
        <input
          type="text"
          placeholder="Search stocks, ETFs, or cryptocurrencies"
          className="search-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="user-profile">
        <Bell size={20} />
        <div style={{ 
          width: '36px', 
          height: '36px', 
          background: '#00d4aa', 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <User size={20} color="#0d1421" />
        </div>
      </div>
    </div>
  );
};

export default Header; 