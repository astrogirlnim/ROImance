import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Dashboard from './components/Dashboard';
import RelationshipView from './components/RelationshipView';
import Portfolio from './components/Portfolio';

import ExampleColorUsage from './components/ExampleColorUsage';
import TradingPage from './components/TradingPage';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
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
