import React from 'react';
import './OrderRequestDriverStatus.css';
import deliveryImage from '../../../images/delivery/incoming_order.png'; 

const OrderRequestDriverStatus = () => {
  return (
    <div className="status-container">
      <h2>Order Request Status</h2>

      <img src={deliveryImage} alt="Delivery Illustration" className="status-image" />

      <p className="accepted-text">
        You have accepted the order:<span className="order-id">id</span><br />
        You will be notified when the order is ready to go
      </p>

      <div className="pickup-box">
        <p className="pickup-text">The order is ready for pickup</p>
        <button className="ok-button">OK</button>
      </div>
    </div>
  );
};

export default OrderRequestDriverStatus;
