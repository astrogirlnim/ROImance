import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Dashboard from './components/Dashboard';
import RelationshipView from './components/RelationshipView';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/relationship/:symbol" element={<RelationshipView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
