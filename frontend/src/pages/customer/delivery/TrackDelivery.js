import React, { useState, useEffect } from 'react';
import './TrackDelivery.css';
import deliveryImage from '../../../images/delivery/res_adimn_delivery.jpg';

const TrackDelivery = ({ deliveryId }) => {
  const [deliveryStatus, setDeliveryStatus] = useState('pending');
  const [loading, setLoading] = useState(true);

  const fetchDeliveryStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:5008/driver/delivery-status/${deliveryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.delivery) {
        setDeliveryStatus(data.delivery.deliveryStatus);
      } else {
        console.error('Failed to fetch delivery status:', data.message);
      }
    } catch (err) {
      console.error('Error fetching delivery status:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:5008/driver/update-status/${deliveryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ deliveryStatus: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setDeliveryStatus(newStatus);
      } else {
        console.error('Error updating delivery status:', data.message);
      }
    } catch (error) {
      console.error('Failed to update delivery status:', error);
    }
  };

  useEffect(() => {
    fetchDeliveryStatus();
  }, [deliveryId]);

  useEffect(() => {
    if (deliveryStatus === 'out_for_delivery') {
      const timer = setTimeout(() => {
        updateDeliveryStatus('delivered');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [deliveryStatus]);

  const statusOrder = (status) => {
    const order = {
      pending: 1,
      in_process: 2,
      ready_for_pickup: 3,
      out_for_delivery: 4,
      delivered: 5,
    };
    return order[status] || 0;
  };

  const getStatusClass = (status) => {
    return deliveryStatus === status
      ? 'active'
      : ['delivered','picked-up', 'ready_for_pickup', 'pending'].includes(deliveryStatus) &&
        statusOrder(status) < statusOrder(deliveryStatus)
      ? 'completed'
      : 'disabled';
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="track-delivery-container">
      <h2>Track Your Delivery</h2>

      <div className="tracking-layout">
        {/* Steps */}
        <div className="status-steps">
        <div className='status-info'>
        <img src={deliveryImage} alt="Delivery Illustration" className="delivery-image-res" />
          <div className={`step ${getStatusClass('pending')}`}>
            <p>Pending</p>
          </div>
          </div>
          <div className='status-info'>
          <img src={deliveryImage} alt="Delivery Illustration" className="delivery-image-res" />
          <div className={`step ${getStatusClass('ready_for_pickup')}`}>
            <p>Ready for Pickup</p>
          </div>
          </div>
          <div className='status-info'>
          <img src={deliveryImage} alt="Delivery Illustration" className="delivery-image-res" />
          <div className={`step ${getStatusClass('picked-up')}`}>
            <p>Picked up</p>
          </div>
          </div>
          <div className='status-info'>
          <img src={deliveryImage} alt="Delivery Illustration" className="delivery-image-res" />
          <div className={`step ${getStatusClass('delivered')}`}>
            <p>Delivered</p>
          </div>
          </div>
        </div>

        {/* Map Preview */}
        <div className="map-preview">
          <img src="/images/map-preview.png" alt="Map" />
          <p>Live Track your order</p>
        </div>
      </div>
    </div>
  );
};

export default TrackDelivery;
