import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderRequestDriverStatus.css';

const OrderRequestDriverStatus = () => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const hasShownPopup = useRef(false); // Track if popup was shown
  const navigate = useNavigate(); // For navigation

  const fetchDelivery = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:5008/driver/deliveries-assigned', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      if (res.ok && data.delivery) {
        setDelivery(data.delivery);

        // Show popup only once when delivery is ready
        if (data.isReady && !hasShownPopup.current) {
          setShowPopup(true);
          hasShownPopup.current = true; // Prevent future popups
        }
      } else {
        setDelivery(null);
      }
    } catch (err) {
      console.error('Failed to fetch assigned delivery:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelivery();

    const interval = setInterval(fetchDelivery, 5000);
    return () => clearInterval(interval);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
    navigate('/delivery-home/delivery_status');
  };

  if (loading) return <p>Loading...</p>;
  if (!delivery) return <p>You are not assigned any orders yet.</p>;

  return (
    <div className="del_status-container">
      <h2>Order Request Status</h2>

      <p className="del_accepted-text">
        You have been assigned the order:
        <span className="del_order-id"> {delivery._id}</span>
      </p>

      {/* Popup Notification */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <p>🚚 The order is ready for pickup!</p>
            <button onClick={closePopup}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderRequestDriverStatus;
