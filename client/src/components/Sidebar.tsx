import React from 'react';
import { 
  Home, 
  TrendingUp, 
  PieChart, 
  Search, 
  Star, 
  Settings,
  CreditCard,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'portfolio', label: 'Portfolio', icon: PieChart },
  { id: 'discover', label: 'Discover', icon: Search },
];

const Sidebar: React.FC<SidebarProps> = ({ activeItem, onItemClick }) => {
  return (
    <div className="sidebar">
      <div className="logo">
        <TrendingUp size={28} />
        ROImance
      </div>
      
      <nav>
        <ul className="nav-menu">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="nav-item">
                <a
                  href="#"
                  className={`nav-link ${activeItem === item.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onItemClick(item.id);
                  }}
                >
                  <Icon size={20} />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <div className="account-value-card">
          <h4 className="account-value-label">
            Account Value
          </h4>
          <div className="account-value-amount">
            $12,845.67
          </div>
          <div className="account-value-change">
            +$247.89 (+1.97%)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 