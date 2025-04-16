import React, { useEffect, useState } from 'react';
import './YourDeliveriesUser.css';

const YourDeliveriesUser = () => {
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    // Fetch deliveries for the user
    const fetchDeliveries = async () => {
      try {
        const response = await fetch('http://localhost:5008/api/delivery/user', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // assuming JWT token
          }
        });
        const data = await response.json();
        setDeliveries(data.deliveries || []);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      }
    };

    fetchDeliveries();
  }, []);

  return (
    <div className="your-deliveries-container">
      <h2 className="your-deliveries-title">Your Order Deliveries</h2>
      <div className="your-deliveries-content">
        <div className="delivery-list">
          {deliveries.map((delivery, index) => (
            <div key={index} className="delivery-card">
              <p><strong>Restaurant name:</strong> {delivery.restaurantName}</p>
              <p><strong>Restaurant address:</strong> {delivery.restaurantAddress}</p>
              <p><strong>Payment Amount:</strong> ${delivery.paymentAmount}</p>
              <p><strong>Items Details:</strong> {delivery.items?.map(item => item.name).join(', ')}</p>
              <p><strong>Delivery status:</strong> {delivery.deliveryStatus}</p>
            </div>
          ))}
        </div>
        <div className="delivery-image">
          <img src="/images/delivery-illustration.png" alt="Delivery" />
        </div>
      </div>
    </div>
  );
};

export default YourDeliveriesUser;
