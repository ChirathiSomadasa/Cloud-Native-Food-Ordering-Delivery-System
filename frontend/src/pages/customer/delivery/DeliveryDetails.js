import React from 'react';
import './DeliveryDetails.css';

const DeliveryDetails = () => {
  return (
    <div className="delivery-container">
      <h2>Delivery Details</h2>
      <div className="form-box">
        <div className="form-group">
          <label>Receiver Name:</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Customer Address:</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Restaurant:</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Order:</label>
          <input type="text" />
        </div>
        <div className="form-group">
          <label>Payment Status:</label>
          <input type="text" />
        </div>
        <div className="button-container">
          <button className="proceed-btn">Proceed</button>
        </div>
      </div>
      <p className="searching-text">Searching for available nearby drivers</p>
    </div>
  );
};

export default DeliveryDetails;
