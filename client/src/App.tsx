import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Dashboard from './components/Dashboard';
import RelationshipView from './components/RelationshipView';
import Portfolio from './components/Portfolio';
import TradingPage from './components/TradingPage';
import LandingPage from './components/LandingPage';

function App() {
  // Use basename for GitHub Pages subdirectory deployment
  const basename = process.env.NODE_ENV === 'production' ? '/ROImance' : '';
  
  return (
    <Router basename={basename}>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/relationship/:symbol" element={<RelationshipView />} />
          <Route path="/trade/:symbol" element={<TradingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
