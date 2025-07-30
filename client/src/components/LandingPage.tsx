import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

/**
 * LandingPage component for the ROImance web application.
 * Displays the title, tagline, and a button to navigate to the Dashboard.
 */
function LandingPage() {
  const navigate = useNavigate();

  /**
   * Handles navigation to the Dashboard.
   */
  const handleNavigation = () => {
    navigate('/dashboard');
  };

  return (
    <div className="landing-page">
      <h1 className="title">ROImance</h1>
      <p className="tagline">Have you ever looked at a relationship and thought that's not gonna work</p>
      <button className="navigate-button" onClick={handleNavigation}>
        Take me to my relationships
      </button>
    </div>
  );
}

export default LandingPage; 