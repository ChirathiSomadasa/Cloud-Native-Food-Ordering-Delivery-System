import React, { useEffect, useState } from 'react';
import './OrderRequestDriverStatus.css';

const OrderRequestDriverStatus = () => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const token = localStorage.getItem('auth_token');

        const res = await fetch('http://localhost:5008/driver/deliveries/assigned', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();

        if (res.ok && data && data.delivery) {
          setDelivery(data.delivery); // backend already filters by driverId
        } else {
          setDelivery(null); // No delivery assigned
        }
      } catch (err) {
        console.error('Failed to fetch assigned delivery:', err);
        setDelivery(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!delivery) {
    return <p>You are not assigned any orders yet.</p>;
  }

  return (
    <div className="del_status-container">
      <h2>Order Request Status</h2>

      <p className="del_accepted-text">
        You have been assigned the order:
        <span className="del_order-id"> {delivery._id}</span><br />
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
