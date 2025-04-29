import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './DeliveryDetails.css';
import deliveryImage from '../../../images/delivery/formdelivery.jpg';

const DeliveryDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = location.state?.items || [];
  const totalItemAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const [receiverName, setReceiverName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [restaurantData, setRestaurantData] = useState([]);
  const [paymentStatus] = useState('Paid');
  const [paymentAmount] = useState(totalItemAmount);
  const [distanceKm, setDistanceKm] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const hardcodedRestaurants = {
    '67e5441c09bef4b21b6417c3': { name: 'Cafe Amaki', address: 'Kurunegala', lat: 7.4863, lng: 80.3629 },
    '67e54cc32603c6fa0217e729': { name: 'Choco Loco', address: 'Kurunegala', lat: 7.4863, lng: 80.3629 },
    '67e57b2ee241c0b6a5cc0eaa': { name: 'Grain & Greens', address: 'Anuradhapura', lat: 8.3114, lng: 80.4037 },
    '67e677ac014d303b13134e47': { name: 'Frost & Flavours', address: 'Kurunegala', lat: 7.4863, lng: 80.3629 },
    '6809d1211d6f19eb59963fbf': { name: 'The Hungry Spoon', address: 'Galle', lat: 6.0535, lng: 80.2210 },
  };

  useEffect(() => {
    const fetchRestaurantData = async () => {
      const groupedData = {};
      for (const item of items) {
        const restaurantId = item.restaurantId;
        if (!groupedData[restaurantId]) {
          groupedData[restaurantId] = {
            name: hardcodedRestaurants[restaurantId]?.name || 'Unknown Restaurant',
            lat: hardcodedRestaurants[restaurantId]?.lat,
            lng: hardcodedRestaurants[restaurantId]?.lng,
            items: [],
            totalAmount: 0,
          };
        }

        groupedData[restaurantId].items.push(item);
        groupedData[restaurantId].totalAmount += item.price * item.quantity;
      }

      const restaurantsArray = Object.values(groupedData);
      setRestaurantData(restaurantsArray);
    };

    if (items.length > 0) fetchRestaurantData();
  }, [items]);

  // Haversine formula to calculate distance between two coordinates
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
  };

  // Mock geocoding: convert deliveryAddress to lat/lng (replace with real geocoding if needed)
  const getMockLatLngFromAddress = (address) => {
    address = address.toLowerCase();

    // Hardcoded cities and their latitudes and longitudes
    const cityCoordinates = {
      'nuwara eliya': { lat: 6.9480, lng: 80.7917 }, // Nuwara Eliya
      'galle': { lat: 6.0535, lng: 80.2210 }, // Galle
      'jaffna': { lat: 9.6615, lng: 80.0229 }, // Jaffna
      'anuradhapura': { lat: 8.3114, lng: 80.4037 }, // Anuradhapura (already in your example)
      'kandy': { lat: 7.2906, lng: 80.6337 }, // Default Kandy
      'colombo': { lat: 6.9271, lng: 79.8612 }, // Colombo
  'kaduwela': { lat: 6.9547, lng: 79.9867 }, // Kaduwela
  'malabe': { lat: 6.9272, lng: 79.9801 }, // Malabe
  'piliyandala': { lat: 6.8542, lng: 79.9825 }, // Piliyandala
  'borella': { lat: 6.9364, lng: 79.9821 }, // Borella
  'thimbirigasyaya': { lat: 6.9244, lng: 79.9869 }, // Thimbirigasyaya
  'dehiwala': { lat: 6.8766, lng: 79.9749 }, // Dehiwala
  'mora': { lat: 6.9331, lng: 79.9916 }, // University of Moratuwa area (Mora)
  
  // Kurunegala area
  'kurunegala': { lat: 7.4863, lng: 80.3629 }, // Kurunegala
  'pothuhera': { lat: 7.6310, lng: 80.3591 }, // Pothuhera
  'wariyapola': { lat: 7.4667, lng: 80.3142 }, // Wariyapola
  'galgamuwa': { lat: 7.5572, lng: 80.3733 }, // Galgamuwa
  'melsiripura': { lat: 7.5093, lng: 80.3928 }, // Melsiripura
  'uduwela': { lat: 7.5295, lng: 80.3496 }, // Uduwela
  'embulgama': { lat: 7.4304, lng: 80.3290 }, // Embulgama
  'kottagedara': { lat: 7.4481, lng: 80.3355 }, // Kottagedara
    };

    // Check if the address contains any of the hardcoded city names
    for (const city in cityCoordinates) {
      if (address.includes(city)) {
        return cityCoordinates[city];
      }
    }

    return { lat: 7.2906, lng: 80.6337 }; // Default: Kandy if city is not found
  };

  useEffect(() => {
    if (deliveryAddress && restaurantData.length > 0) {
      const userLoc = getMockLatLngFromAddress(deliveryAddress);
      const restaurantLoc = { lat: restaurantData[0].lat, lng: restaurantData[0].lng };

      const distance = haversineDistance(
        userLoc.lat,
        userLoc.lng,
        restaurantLoc.lat,
        restaurantLoc.lng
      );

      const validDistance = distance > 0 ? distance : 5; 
      setDistanceKm(validDistance);

    }
  }, [deliveryAddress, restaurantData]);

  const calculateEstimatedTime = (distanceKm) => {
    let estimatedTimeInSeconds = 0;

    if (distanceKm <= 5) {
      estimatedTimeInSeconds = 12 * 60; // 12 minutes
    } else {
      const extraKm = distanceKm - 5;
      estimatedTimeInSeconds = 12 * 60 + extraKm * (2 * 60 + 50); // 2 min 50 sec per km
    }

    const totalMinutes = Math.round(estimatedTimeInSeconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    let result = '';
    if (hours > 0) {
      result += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (hours > 0) result += ' ';
      result += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }

    return result || '0 minutes';
  };

  const handleProceed = async () => {
    if (!receiverName || !deliveryAddress || items.length === 0 || !paymentStatus || !paymentAmount) {
      setError('All fields are required to be filled to proceed.');
      return;
    }

    const deliveryFee = 100;
    const totalAmount = (parseFloat(paymentAmount) + deliveryFee).toFixed(2);
    const estimatedDeliveryTime = calculateEstimatedTime(distanceKm);

    const deliveryData = {
      receiverName,
      deliveryAddress,
      restaurants: restaurantData.map((restaurant) => ({
        restaurantName: restaurant.name,
        orderedItems: restaurant.items.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      })),
      paymentAmount: parseFloat(paymentAmount),
      paymentStatus,
      distance: distanceKm,
      estimatedDeliveryTime,
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

  const grandTotal = (parseFloat(paymentAmount) + 100).toFixed(2);
  const estimatedDeliveryTime = calculateEstimatedTime(distanceKm);

  return (
    <div className="delivery-template-container">
      <h2 className="form-heading">Delivery Details</h2>

      <div className="form-layout">
        <div className="form-left">
          <img src={deliveryImage} alt="Delivery Illustration" className="left-illustration" />
        </div>

        <div className="form-right">
          <div className="input-row">
            <label>Receiver Name:</label>
            <input type="text" value={receiverName} onChange={(e) => setReceiverName(e.target.value)} />
          </div>

          <div className="input-row">
            <label>Receiver Address:</label>
            <input type="text" value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} />
          </div>

          {restaurantData.map((restaurant, index) => (
            <div key={index} className="restaurant-box">
              <div><strong>Restaurant name:</strong> {restaurant.name}</div>
              <div><strong>Items ordered:</strong></div>
              {restaurant.items.map((item, i) => (
                <div key={i} className="item-line">
                  item {i + 1}×{item.quantity}= {item.price * item.quantity}
                </div>
              ))}
              <hr />
              <div className="total-line">
                total Amount for {restaurant.name}  = <strong>LKR {restaurant.totalAmount.toFixed(2)}</strong>
              </div>
            </div>
          ))}

          <div className="input-row">
            <label>Delivery Distance (km):</label>
            <input type="text" value={distanceKm || ''} readOnly />
          </div>

          <div className="delivery-charges">
            <span style={{ color: 'red' }}>
              Delivery charges:
              LKR 100 only
            </span>
          </div>

          <div className="input-row">
            <label>Estimated Delivery Time:</label>
            <input type="text" readOnly value={estimatedDeliveryTime} />
          </div>

          <div className="amount-box">
            <div><strong>= Total Amount (Items + Delivery):</strong></div>
            <input type="text" readOnly value={`LKR ${grandTotal}`} />
          </div>

          <button className="proceed-btn" onClick={handleProceed}>Proceed</button>
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>

      {isSubmitting && <p className="searching-text">Searching for available nearby drivers...</p>}

      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>✅ Order Placed Successfully</h3>
            <p>Your delivery request has been received and is being processed.</p>
            <button className="ok-btn" onClick={() => navigate('/')}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDetails;
