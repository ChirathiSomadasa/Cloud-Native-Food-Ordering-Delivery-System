import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import foodImage from '../../../images/delivery/driver.jpg';

const Home = () => {
  const navigate = useNavigate();

  const goToOrders = () => {
    navigate('/delivery-home/order_status');
  };

  const goToStatus = () => {
    navigate('/delivery-home/delivery_status');
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-text">
          <h2>
            <span className="highlight">Deliver Fast</span> <span className="highlight-yellow">Make them smile</span>
          </h2>
          <h3>Let's Hit the Road</h3>
          <p>
            Welcome to your driver dashboard. Keep track of your deliveries, view restaurant requests, and stay updated in real time. 
            You're an essential part of helping local businesses thrive — thank you for being on the team.
          </p>
        </div>
        <div className="hero-image">
          <img src={foodImage} alt="Food delivery app" />
        </div>
      </div>

      <div className="action-section">
        <div className="action-card">
          <span className="action-title">Check your Orders</span>
          <button className="action-btn" onClick={goToOrders}>Check</button>
        </div>
        <div className="action-card">
          <span className="action-title">Update Your Status</span>
          <button className="action-btn" onClick={goToStatus}>Status</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
