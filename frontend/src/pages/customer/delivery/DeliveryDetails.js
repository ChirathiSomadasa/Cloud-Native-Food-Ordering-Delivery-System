import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './DeliveryDetails.css';
import deliveryImage from '../../../images/delivery/formdelivery.jpg';

const DeliveryDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = location.state?.items || [];
  const restaurantId = items.length > 0 ? items[0].restaurantId : '';
  const totalItemAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const [receiverName, setReceiverName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [restaurantName, setRestaurantName] = useState('Loading...');
  const [paymentStatus] = useState('Paid');
  const [paymentAmount] = useState(totalItemAmount);
  const [distanceKm, setDistanceKm] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  useEffect(() => {
    const fetchRestaurantName = async () => {
      try {
        const response = await axios.get(`http://localhost:5004/api/restaurants/${restaurantId}`);
        setRestaurantName(response.data.name);
      } catch (err) {
        console.error('Error fetching restaurant name:', err);
        setRestaurantName('Unknown Restaurant');
      }
    };

    if (restaurantId) fetchRestaurantName();
  }, [restaurantId]);

  // Calculate estimated delivery time based on distance
  const calculateEstimatedTime = (distanceKm) => {
    let estimatedTimeInSeconds = 0;
    if (distanceKm <= 5) {
      estimatedTimeInSeconds = 12 * 60; // 12 minutes
    } else {
      const extraKm = distanceKm - 5;
      estimatedTimeInSeconds = 12 * 60 + extraKm * (2 * 60 + 50); // 2 min 50 sec per extra km
    }

    // Convert to mm:ss or a readable format like "15 minutes"
    const minutes = Math.floor(estimatedTimeInSeconds / 60);
    const seconds = estimatedTimeInSeconds % 60;
    return `${minutes} minute${minutes !== 1 ? 's' : ''}${seconds > 0 ? ` ${seconds} seconds` : ''}`;
  };

  const handleProceed = async () => {
    if (
      !receiverName ||
      !deliveryAddress ||
      items.length === 0 ||
      !paymentStatus ||
      !paymentAmount ||
      !distanceKm
    ) {
      setError('All fields are required to be filled to proceed.');
      return;
    }

    const deliveryFee = distanceKm <= 5 ? 200 : 200 + (distanceKm - 5) * 25;
    const totalAmount = (parseFloat(paymentAmount) + deliveryFee).toFixed(2);
    const estimatedDeliveryTime = calculateEstimatedTime(distanceKm); // Get estimated time

    const deliveryData = {
      receiverName,
      deliveryAddress,
      restaurantName,
      orderedItems: items,
      paymentAmount: parseFloat(paymentAmount),
      paymentStatus,
      distance: distanceKm,
      estimatedDeliveryTime, // use calculated value
      deliveryFee,
      totalAmount,
    };

    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post(
        'http://localhost:5008/delivery/create',
        deliveryData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setIsSubmitting(true);
        setTimeout(() => {
          setShowSuccessPopup(true);
        }, 5000);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Failed to create delivery:', error);

      let message = 'Failed to create delivery. Please try again.';
      if (error.response?.data?.message) {
        message = `Error: ${error.response.data.message}`;
      } else if (typeof error.response?.data === 'string') {
        message = `Error: ${error.response.data}`;
      } else if (error.request) {
        message = 'No response from server. Please check your network.';
      } else {
        message = `Unexpected error: ${error.message}`;
      }

      setError(message);
      alert(message);
    }
  };

  const deliveryFee = distanceKm <= 5 ? 200 : 200 + (distanceKm - 5) * 25;
  const grandTotal = (parseFloat(paymentAmount) + deliveryFee).toFixed(2);
  const estimatedDeliveryTime = calculateEstimatedTime(distanceKm); // Get estimated time

  return (
    <div className="delivery-container">
      <h2 className="delivery-title">Recipient & Delivery Details</h2>

      <div className="delivery-content">
        {!isSubmitting && (
          <div className="image-section">
            <img src={deliveryImage} alt="Delivery Visual" className="delivery-image" />
          </div>
        )}

        {!isSubmitting && (
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
              <input type="text" value={restaurantName} disabled />
            </div>
            <div className="form-group">
              <label>Payment Status:</label>
              <input type="text" value={paymentStatus} disabled />
            </div>
            <div className="form-group">
              <label>Ordered Items:</label>
              <ul className="ordered-items-list">
                {items.map((item, index) => (
                  <li key={index}>
                    {item.name} × {item.quantity} = <strong>LKR {(item.price * item.quantity).toFixed(2)}</strong>
                  </li>
                ))}
              </ul>
            </div>
            <div className="form-group">
              <label>Delivery Distance (in km):</label>
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label>Delivery Fee:</label>
              <p>LKR 200 for first 5km + LKR 25/km after that</p>
              <p style={{ fontWeight: 'bold' }}>Fee: LKR {deliveryFee}</p>
            </div>
            <div className="form-group">
              <label>Estimated Delivery Time:</label>
              <p style={{ fontWeight: 'bold' }}>{estimatedDeliveryTime}</p>
            </div>
            <div className="form-group">
              <label>Total Amount (Items + Delivery):</label>
              <p style={{ fontWeight: 'bold', fontSize: '16px' }}>LKR {grandTotal}</p>
            </div>
            <div className="button-container">
              <button className="proceed-btn" onClick={handleProceed}>Proceed</button>
            </div>
            {error && <p className="error-text" style={{ color: 'red' }}>{error}</p>}
          </div>
        )}
      </div>

      {isSubmitting && (
        <p className="searching-text">Searching for available nearby drivers...</p>
      )}

      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>✅ Order Placed Successfully</h3>
            <p>Your delivery request has been received and is being processed. A driver will be assigned shortly.</p>
            <button className="ok-btn" onClick={() => navigate('/')}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDetails;
