import React from "react";
import "./OrderRequest.css";

const OrderRequest = ({ restaurantName, customerAddress, distance, onAccept, onDecline }) => {
  return (
    <div className="order-container">
      <h2>Incoming Order Request</h2>
      <div className="order-content">
        <img src="order-image.png" alt="Order Request" className="order-image" />
        <div className="order-details">
          <p><strong>Restaurant Name:</strong> {restaurantName}</p>
          <p><strong>Customer Address:</strong> {customerAddress}</p>
          <p><strong>Distance to Restaurant:</strong> {distance} km</p>
        </div>
        <div className="order-actions">
          <button className="accept-btn" onClick={onAccept}>ACCEPT</button>
          <button className="decline-btn" onClick={onDecline}>DECLINE</button>
        </div>
      </div>
    </div>
  );
};

export default OrderRequest;
