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
      <div className="landing-content">
        <h1 className="title">Shares for Pairs</h1>
        <p className="tagline">Have you ever thought to yourself "that relationship is never going to work"? Well now you can put money where your mouth is.</p>
        <button className="navigate-button" onClick={handleNavigation}>
          Take Me to My Relationships
        </button>
      </div>
    </div>
  );
}

export default LandingPage; 