import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeliveryDetails.css';
import deliveryImage from '../../../images/delivery/formdelivery.jpg';

const DeliveryDetails = () => {
  const [receiverName, setReceiverName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [orderedItems, setOrderedItems] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleProceed = () => {
    if (
      !receiverName ||
      !deliveryAddress ||
      !restaurant ||
      !orderedItems ||
      !paymentStatus ||
      !paymentAmount
    ) {
      setError('All fields are required to be filled to proceed.');
      return;
    }

    navigate('/deliveries/track_deliveries');
  };

  return (
    <div className="delivery-container">
      <h2 className="delivery-title">Recipient & Delivery Details</h2>

      <div className="delivery-content">
        <div className="image-section">
          <img src={deliveryImage} alt="Delivery Visual" className="delivery-image" />
        </div>

        <div className="form-box">
          <div className="form-group">
            <label>Receiver Name:</label>
            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Customer Address:</label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Restaurant:</label>
            <input
              type="text"
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Ordered Items:</label>
            <input
              type="number"
              value={orderedItems}
              onChange={(e) => setOrderedItems(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Payment Status:</label>
            <input
              type="text"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Payment Amount:</label>
            <input
              type="text"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
          </div>

          <div className="button-container">
            <button className="proceed-btn" onClick={handleProceed}>
              Proceed
            </button>
          </div>

          {error && <p className="error-text" style={{ color: 'red' }}>{error}</p>}
        </div>
      </div>

      <p className="searching-text">Searching for available nearby drivers</p>
    </div>
  );
};

export default DeliveryDetails;
