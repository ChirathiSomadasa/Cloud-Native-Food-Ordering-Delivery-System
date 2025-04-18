import React from 'react';
import './OrderRequestDriverStatus.css';
// import deliveryImage from '../../../images/delivery/incoming_order.png'; 

const OrderRequestDriverStatus = () => {
  return (
    <div className="del_status-container">
      <h2>Order Request Status</h2>

      {/* <img src={deliveryImage} alt="Delivery Illustration" className="del_status-image" /> */}

      <p className="del_accepted-text">
        You have been assigned the order:<span className="del_order-id">id</span><br />
        You will be notified when the order is ready to go
      </p>

      <div className="del_pickup-box">
        <p className="del_pickup-text">The order is ready for pickup</p>
        <button className="del_ok-button">OK</button>
      </div>
    </div>
  );
};

export default OrderRequestDriverStatus;
