import React from 'react';
import deliveryImage from '../../../images/delivery/status.jpg'; 
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
    <div className="driver_delivery-status-container">
      <h2 className="driver_delivery-title">Delivery Status</h2>

      <div className="driver_order-details-section">
        <h3 className="driver_order-details-title">Order details:</h3>

        <div className="driver_order-info-box">
          <p>Customer name: {customerName}</p>
          <p>Customer address: {customerAddress}</p>
          <p>Distance: {distance}</p>
          <p>Time for delivery: {deliveryTime}</p>
        </div>

        <div className="driver_order-image">
          <img src={deliveryImage} alt="Delivery Illustration" />
        </div>
      </div>

      <div className="driver_status-box light-blue">
        <p className="driver_status-label">Order is picked up</p>
        <button className="driver_done-button" onClick={onPickupDone}>Done</button>
      </div>

      <div className="driver_status-box light-blue">
        <p className="driver_status-label">Order is delivered</p>
        <button className="driver_done-button" onClick={onDeliveredDone}>Done</button>
      </div>
    </div>
  );
};

export default DeliveryStatus;
