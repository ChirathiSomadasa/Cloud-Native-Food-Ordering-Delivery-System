import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import deliveryImage from '../../../images/delivery/status.jpg';
import './DeliveryStatus.css';

const DeliveryStatus = () => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('auth_token');

  const fetchReadyDelivery = async () => {
    try {
      const res = await fetch('http://localhost:5008/driver/delivery-ready', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok && data.delivery) {
        setDelivery(data.delivery);
        setStatus(data.delivery.deliveryStatus);
      } else {
        setDelivery(null);
      }
    } catch (error) {
      console.error('Failed to fetch delivery:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (newStatus) => {
    try {
      const res = await fetch(`http://localhost:5008/driver/update-status/${delivery._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ deliveryStatus: newStatus }),
      });

      if (res.ok) {
        const updated = await res.json();
        setStatus(updated.delivery.deliveryStatus);

        // If delivered, clear delivery after short delay
        if (newStatus === 'delivered') {
          setTimeout(() => {
            setDelivery(null);
          }, 1000); // optional: wait 1s before hiding
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  useEffect(() => {
    fetchReadyDelivery();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!delivery) return <p>No delivery currently ready for pickup.</p>;

  return (
    <div className="driver_delivery-status-container">
      <h2 className="driver_delivery-title">Delivery Status</h2>

      <div className="driver_order-details-section">
        <h3 className="driver_order-details-title">Order details:</h3>

        <div className="driver_order-info-box">
          <p>Customer name: {delivery.receiverName}</p>
          <p>Customer address: {delivery.deliveryAddress}</p>
          <p>Distance: {delivery.distance} km</p>
          <p>Estimated delivery time: {delivery.estimatedDeliveryTime}</p>
        </div>

        <div className="driver_order-image">
          <img src={deliveryImage} alt="Delivery Illustration" />
        </div>
      </div>

      {status === 'ready_for_pickup' && (
        <div className="driver_status-box light-blue">
          <p className="driver_status-label">Order is ready for pickup</p>
          <button
            className="driver_done-button"
            onClick={() => updateDeliveryStatus('picked-up')}
          >
            Done
          </button>
        </div>
      )}

      {status === 'picked-up' && (
        <div className="driver_status-box light-blue">
          <p className="driver_status-label">Order is delivered</p>
          <button
            className="driver_done-button"
            onClick={() => updateDeliveryStatus('delivered')}
          >
            Done
          </button>
        </div>
      )}

      {status === 'delivered' && (
        <div className="driver_status-box light-blue">
          <p className="driver_status-label">Order is delivered</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryStatus;
