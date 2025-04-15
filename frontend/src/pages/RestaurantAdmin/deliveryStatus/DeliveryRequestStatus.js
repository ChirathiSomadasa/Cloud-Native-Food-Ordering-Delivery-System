import React from 'react';
import './DeliveryRequestStatus.css';
import deliveryImage from '../../../images/delivery/incoming_order.png'; 

const DeliveryRequestStatus = ({ driverName, orderId, onNotify, isDriverNotified }) => {
  return (
    <div className="delivery-request-container">
      <h2 className="delivery-title">Order Request Status</h2>

       <img src={deliveryImage} alt="Delivery Illustration" className="status-image" />

      <p className="delivery-accepted">
        Driver: <span className="driver-name">{driverName}</span> accepted the order:<span className="delivery-id">{orderId}</span>
      </p>

      {!isDriverNotified ? (
        <div className="notify-box">
          <p>Notify driver for pickup</p>
          <button className="notify-button" onClick={onNotify}>Notify</button>
        </div>
      ) : (
        <div className="status1-box">
          Driver is on the way for pickup
        </div>
      )}
    </div>
  );
};

export default DeliveryRequestStatus;
