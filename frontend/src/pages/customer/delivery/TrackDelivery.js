import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5008');

const TrackDelivery = ({ deliveryId }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const initMap = (location) => {
      const google = window.google;
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15
      });

      const newMarker = new google.maps.Marker({
        position: location,
        map: mapInstance,
        title: "Driver Location"
      });

      setMap(mapInstance);
      setMarker(newMarker);
    };

    // Load Google Maps
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY`;
      script.async = true;
      script.onload = () => initMap({ lat: 0, lng: 0 });
      document.head.appendChild(script);
    } else {
      initMap({ lat: 0, lng: 0 });
    }

    // Listen for socket updates
    socket.on(`driverLocationUpdate:${deliveryId}`, ({ lat, lng }) => {
      const newLocation = { lat, lng };
      if (map && marker) {
        marker.setPosition(newLocation);
        map.panTo(newLocation);
      }
    });

    return () => {
      socket.off(`driverLocationUpdate:${deliveryId}`);
    };
  }, [map, marker, deliveryId]);

  return (
    <div>
      <h2>Track Your Delivery</h2>
      <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default TrackDelivery;
