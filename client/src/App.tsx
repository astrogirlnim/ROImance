import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Dashboard from './components/Dashboard';
import RelationshipView from './components/RelationshipView';
import ExampleColorUsage from './components/ExampleColorUsage';

function App() {
  return (
    <Router>
      <div className="app" style={{ 
        backgroundColor: 'var(--background)', 
        color: 'var(--foreground)',
        minHeight: '100vh' 
      }}>
        <header style={{ 
          backgroundColor: 'var(--nav-bg)', 
          borderBottom: '1px solid var(--nav-border)',
          padding: 'var(--nav-padding, 1rem)'
        }}>
          <h1 style={{ color: 'var(--trust-blue)', margin: 0 }}>
            ROImance
          </h1>
        </header>
        
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/relationship/:symbol" element={<RelationshipView />} />
            <Route path="/colors" element={<ExampleColorUsage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
