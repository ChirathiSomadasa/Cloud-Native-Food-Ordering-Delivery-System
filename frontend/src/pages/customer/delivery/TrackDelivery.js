import React, { useState, useEffect, useRef } from 'react';
import './TrackDelivery.css';
import { io } from 'socket.io-client';
import Pending from '../../../images/delivery/pending.png';
import OnTheWay from '../../../images/delivery/ontheway.jpg';
import pickedUp from '../../../images/delivery/pickedup.png';
import delivered from '../../../images/delivery/delivered.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const deliveryId = "680db8a76c019f23472c927f";
const socket = io('http://localhost:5008');

const TrackDelivery = () => {
  const [deliveryStatus, setDeliveryStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

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
    socket.emit('joinRoom', deliveryId);

    // Status update
    socket.on('deliveryStatusUpdate', (newStatus) => {
      setDeliveryStatus(newStatus);
    });

    // 🔔 Real-time Notification
    socket.on('notification', ({ title, message }) => {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: delivered
        });
      }
    });

    // Location updates
    socket.on('locationUpdate', (data) => {
      if (data.deliveryId === deliveryId) {
        const { lat, lng } = data.location;
        if (!mapRef.current) {
          mapRef.current = L.map('live-map').setView([lat, lng], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
          }).addTo(mapRef.current);
          markerRef.current = L.marker([lat, lng]).addTo(mapRef.current).bindPopup('Driver Location').openPopup();
        } else {
          markerRef.current.setLatLng([lat, lng]);
          mapRef.current.setView([lat, lng]);
        }
      }
    });

    // Request permission for notifications
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    return () => {
      socket.emit('leaveRoom', deliveryId);
      socket.off('deliveryStatusUpdate');
      socket.off('notification');
      socket.off('locationUpdate');
    };
  }, [deliveryId]);

  useEffect(() => {
    if (deliveryStatus === 'out_for_delivery') {
      const timer = setTimeout(() => {
        updateDeliveryStatus('delivered');
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (deliveryStatus === 'delivered') {
      alert('Order Complete! Enjoy your meal 🍽️. A receipt has been sent to your email.');
      const sendEmailReceipt = async () => {
        try {
          const token = localStorage.getItem('auth_token');
          await fetch(`http://localhost:5008/driver/send-receipt/${deliveryId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (error) {
          console.error('Failed to send email receipt:', error);
        }
      };
      sendEmailReceipt();
    }
  }, [deliveryStatus]);

  const statusOrder = (status) => {
    const order = {
      pending: 1,
      ready_for_pickup: 2,
      "picked-up": 3,
      out_for_delivery: 4,
      delivered: 5,
    };
    return order[status] || 0;
  };

  const getStatusClass = (status) => {
    return deliveryStatus === status
      ? 'active'
      : statusOrder(status) < statusOrder(deliveryStatus)
      ? 'completed'
      : 'disabled';
  };
 
  if (loading) return <p>Loading...</p>;

  return (
    <div className="track-delivery-container">
      <h2>Track Your Delivery</h2>
      <div className="tracking-layout">
      <div className="status-steps">
  {[
    { status: 'pending', image: Pending },
    { status: 'ready_for_pickup', image: pickedUp },
    { status: 'picked-up', image:OnTheWay },
    { status: 'delivered', image: delivered }
  ].map(({ status, image }) => (
    <div key={status} className="status-info">
      <img src={image} alt={status} className="delivery-image-res" />
      <div className={`step ${getStatusClass(status)}`}>
        <p>{status.replace(/_/g, ' ')}</p>
      </div>
    </div>
  ))}
</div>

        <div className="map-preview">
          <div id="live-map" style={{ height: "300px", width: "100%" }}></div>
          <p>Live Track your order</p>
        </div>
      </div>
    </div>
  );
};

export default TrackDelivery;
