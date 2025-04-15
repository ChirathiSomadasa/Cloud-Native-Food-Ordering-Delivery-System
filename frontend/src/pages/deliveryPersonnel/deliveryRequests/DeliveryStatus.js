import React from 'react';
import './DeliveryStatus.css';

const DeliveryStatus = ({
  customerName,
  customerAddress,
  distance,
  deliveryTime,
  onPickupDone,
  onDeliveredDone
}) => {
  return (
    <div className="delivery-status-container">
      <h2 className="delivery-title">Delivery Status</h2>

      <div className="order-details-section">
        <h3 className="order-details-title">Order details:</h3>

        <div className="order-info-box">
          <p>Customer name: {customerName}</p>
          <p>Customer address: {customerAddress}</p>
          <p>Distance: {distance}</p>
          <p>Time for delivery: {deliveryTime}</p>
        </div>

        <div className="order-image">
          <img src="/images/food-delivery.png" alt="Delivery Illustration" />
        </div>
      </div>

      <div className="status-box light-blue">
        <p className="status-label">Order is picked up</p>
        <button className="done-button" onClick={onPickupDone}>Done</button>
      </div>

      <div className="status-box light-blue">
        <p className="status-label">Order is delivered</p>
        <button className="done-button" onClick={onDeliveredDone}>Done</button>
      </div>
    </div>
  );
};

export default DeliveryStatus;
