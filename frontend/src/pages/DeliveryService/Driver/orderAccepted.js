import React from "react";
import "./RequestStatus.css";

const OrderAccepted = ({ orderId, onAcknowledge }) => {
  return (
    <div className="status-container">
      <h2>Order Request Status</h2>
      <div className="status-content">
        <img src="order-status.png" alt="Order Status" className="status-image" />
        <p className="status-message">
          You have accepted the order: <strong>{orderId}</strong>
          <br />
          You will be notified when the order is ready to go
        </p>
        <div className="status-notification">
          <p><strong>The order is ready for pickup</strong></p>
          <button className="ok-btn" onClick={onAcknowledge}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default OrderAccepted;
