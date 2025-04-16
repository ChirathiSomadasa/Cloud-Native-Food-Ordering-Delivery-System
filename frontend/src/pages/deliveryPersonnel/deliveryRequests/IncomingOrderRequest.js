import React from 'react';
import './IncomingOrderRequest.css';
import orderImage from '../../../images/delivery/incoming_order.png'; 


const IncomingOrderRequest = () => {
  return (
    <div className="order-request-container">
      <h2>Incoming Order Request</h2>

      <img src={orderImage} alt="Order Illustration" className="order-image" />

      <div className="order-info-box">
        <p><strong>Restaurant Name:</strong> Where the food is coming from.</p>
        <p><strong>Customer Address:</strong> Where the food needs to be delivered.</p>
        <p><strong>Distance to Restaurant:</strong> How far the driver is from the restaurant.</p>

        <div className="action-buttons">
          <button className="accept-btn">ACCEPT</button>
          <button className="decline-btn">DECLINE</button>
        </div>
      </div>
    </div>
  );
};

export default IncomingOrderRequest;
