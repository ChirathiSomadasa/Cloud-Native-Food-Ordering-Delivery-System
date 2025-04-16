import React from 'react';
import './IncomingOrderRequest.css';
import orderImage from '../../../images/delivery/incomingorder.jpg'; 


const IncomingOrderRequest = () => {
  return (
    <div className="deliveryorder-request-container">
      <h2>Incoming Order Request</h2>

      <img src={orderImage} alt="Order Illustration" className="deliveryorder-image" />

      <div className="deliveryorder-info-box">
        <p><strong>Restaurant Name:</strong> Where the food is coming from.</p>
        <p><strong>Customer Address:</strong> Where the food needs to be delivered.</p>
        <p><strong>Distance to Restaurant:</strong> How far the driver is from the restaurant.</p>

        <div className="deliveryorder_action-buttons">
          <button className="deliveryorder_accept-btn">ACCEPT</button>
          <button className="deliveryorder_decline-btn">DECLINE</button>
        </div>
      </div>
    </div>
  );
};

export default IncomingOrderRequest;
