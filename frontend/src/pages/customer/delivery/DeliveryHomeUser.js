import React, { useEffect, useState } from 'react';
import './DeliveryHomeUser.css';
import { useNavigate } from 'react-router-dom';

const DeliveryHomeUser = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true); // to avoid showing UI before auth check

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert('Please log in to access delivery features.');
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  const handleNavigation = (path) => {
    if (!isAuthenticated) {
      alert('Please Login to continue with our delivery feature');
      return;
    }
    navigate(path);
  };

  if (checkingAuth) {
    return <div className="home-container">Checking authentication...</div>;
  }

  return (
    <div className="home-container">
      <h2 className="home-title">Track & Explore Your Deliveries</h2>

      <div className="home-section">
        <h3 className="home-subtitle">Explore Your Order History</h3>
        <button className="home-button" onClick={() => handleNavigation('/deliveries/your_deliveries')}>
          Explore
        </button>
      </div>

      <div className="home-section">
        <h3 className="home-subtitle">Active Delivery Tracking</h3>
        <button className="home-button" onClick={() => handleNavigation('/deliveries/track_deleveries')}>
          Track
        </button>
      </div>
    </div>
  );
};

export default DeliveryHomeUser;
