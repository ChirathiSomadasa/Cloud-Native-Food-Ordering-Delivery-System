import React, { useState, useEffect, useRef } from 'react';
import './TrackDelivery.css';
import { io } from 'socket.io-client';
import Pending from '../../../images/delivery/pending.png';
import OnTheWay from '../../../images/delivery/on_the_way.png';
import pickedUp from '../../../images/delivery/pickedup.png';
import delivered from '../../../images/delivery/delivered.png';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const receiverAddress = 'Kandy';
const deliveryId = "680db8a76c019f23472c927f";
const socket = io('http://localhost:5008');
const restaurant = {
  name: 'Cafe Amaki',
  lat: 7.4863,
  lng: 80.3629,
};

const statusSteps = [
  { status: 'pending', image: Pending, label: 'Pending' },
  { status: 'ready_for_pickup', image: pickedUp, label: 'Ready for Pickup' },
  { status: 'picked-up', image: OnTheWay, label: 'On the Way' },  // Map 'picked-up' to 'On the Way'
  { status: 'delivered', image: delivered, label: 'Delivered' },
];

const getCoordinatesFromAddress = async (address) => {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (err) {
    console.error('Geocoding failed:', err);
  }
  return null;
};

const TrackDelivery = () => {
  const [deliveryStatus, setDeliveryStatus] = useState('pending');
  const [location, setLocation] = useState(null);
  const [receiverCoords, setReceiverCoords] = useState(null);
  const mapRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const polylineRef = useRef(null);

  // Fetch Delivery Status
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
        setLocation(data.delivery.driverDetails.location);
        setReceiverCoords(data.delivery.deliveryAddress);
      } else {
        console.error('Failed to fetch delivery status:', data.message);
      }
    } catch (err) {
      console.error('Error fetching delivery status:', err);
    }
  };

  // Update Delivery Status
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

  // Map Initialization
  useEffect(() => {
    const initMap = async () => {
      const receiver = await getCoordinatesFromAddress(receiverAddress);
      if (!receiver) return;

      setReceiverCoords(receiver);

      const midLat = (restaurant.lat + receiver.lat) / 2;
      const midLng = (restaurant.lng + receiver.lng) / 2;

      if (mapRef.current) {
        mapRef.current.remove();
      }

      mapRef.current = L.map('live-map').setView([midLat, midLng], 8);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);

      // Restaurant marker
      L.marker([restaurant.lat, restaurant.lng], {
        icon: L.divIcon({
          className: 'restaurant-icon',
          html: `<span class="material-icons">restaurant</span>`,
        }),
      }).addTo(mapRef.current).bindPopup('Restaurant').openPopup();

      // Receiver marker
      L.marker([receiver.lat, receiver.lng], {
        icon: L.divIcon({
          className: 'receiver-icon',
          html: `<span class="material-icons">location_on</span>`,
        }),
      }).addTo(mapRef.current);

      L.Routing.control({
        waypoints: [
          L.latLng(restaurant.lat, restaurant.lng), // Restaurant location
          L.latLng(receiver.lat, receiver.lng), // Receiver location
        ],
        routeWhileDragging: true,
    }).addTo(mapRef.current);

      // Driver marker
      driverMarkerRef.current = L.marker([restaurant.lat, restaurant.lng], {
        icon: L.divIcon({
          className: 'driver-icon',
          html: `<span class="material-icons">directions_car</span>`,
        }),
      }).addTo(mapRef.current);
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [receiverAddress]);

  

  // Simulate Driver Movement
  useEffect(() => {
    if (!receiverCoords || !driverMarkerRef.current) return;

    if (deliveryStatus === 'pending' || deliveryStatus === 'picked-up') {
      driverMarkerRef.current.setLatLng([restaurant.lat, restaurant.lng]);
    } else if (deliveryStatus === 'on-the-way' || deliveryStatus === 'picked-up') {
      simulateDriverMovement(restaurant, receiverCoords);
    } else if (deliveryStatus === 'delivered') {
      driverMarkerRef.current.setLatLng([receiverCoords.lat, receiverCoords.lng]);
      mapRef.current.panTo([receiverCoords.lat, receiverCoords.lng]);
    }
  }, [deliveryStatus, receiverCoords]);

  const simulateDriverMovement = (start, end) => {
    const steps = 100;
    let i = 0;

    const latDiff = (end.lat - start.lat) / steps;
    const lngDiff = (end.lng - start.lng) / steps;

    const interval = setInterval(() => {
      if (i > steps) {
        clearInterval(interval);
        return;
      }

      const newLat = start.lat + latDiff * i;
      const newLng = start.lng + lngDiff * i;
      driverMarkerRef.current.setLatLng([newLat, newLng]);
      mapRef.current.panTo([newLat, newLng]);
      i++;
    }, 100); // Adjust the speed here by changing the interval (100ms)
  };

  const statusOrder = {
    pending: 1,
    'picked-up': 2,
    'on-the-way': 3,
    delivered: 4,
  };

  const getStatusClass = (status) => {
    if (status === deliveryStatus) return 'active';
    if (statusOrder[status] < statusOrder[deliveryStatus]) return 'completed';
    return 'disabled';
  };

  useEffect(() => {
    fetchDeliveryStatus();
    socket.emit('joinRoom', deliveryId);

    // Location updates
    socket.on('locationUpdate', (data) => {
      if (data.deliveryId === deliveryId) {
        const { lat, lng } = data.location;
        if (mapRef.current) {
          driverMarkerRef.current.setLatLng([lat, lng]);
          mapRef.current.setView([lat, lng]);
        }
      }
    });

    // Status update
    socket.on('deliveryStatusUpdate', (newStatus) => {
      setDeliveryStatus(newStatus);
    });

    return () => {
      socket.emit('leaveRoom', deliveryId);
      socket.off('locationUpdate');
      socket.off('deliveryStatusUpdate');
    };
  }, [deliveryId]);

  return (
    <div className="track-delivery-container">
      <h2>Track Your Delivery</h2>
      <div className="tracking-layout">
        <div className="status-steps">
          {statusSteps.map(({ status, image }) => (
            <div key={status} className="status-info">
              <img src={image} alt={status} className="delivery-image-res" />
              <div className={`step ${getStatusClass(status)}`}>
                <p>{status.replace(/_/g, ' ')}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="map-preview">
          <div id="live-map" style={{ height: '500px', width: '100%' }}></div>
          <p>Live Track your order</p>
        </div>
      </div>
    </div>
  );
};

export default TrackDelivery;
