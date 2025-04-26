import React, { useEffect, useState } from 'react';
import './DeliveryRequestStatus.css';
import deliveryImage from '../../../images/delivery/res_adimn_delivery.jpg';

const DeliveryRequestStatus = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifiedDeliveries, setNotifiedDeliveries] = useState([]);

  // Fetch deliveries data from the backend
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('http://localhost:5008/driver/deliveries_res', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (response.ok) {
          setDeliveries(data);
        } else {
          console.error('Failed to fetch deliveries:', data.error);
        }
      } catch (err) {
        console.error('Error fetching deliveries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  // Handle the notification state for each delivery
  const handleNotify = async (index, deliveryId) => {
    try {
      const response = await fetch(`http://localhost:5008/driver/notify_delivery/${deliveryId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setNotifiedDeliveries((prev) => [...prev, index]);
      } else {
        console.error('Notification failed:', result.message);
      }
    } catch (error) {
      console.error('Error notifying driver:', error);
    }
  };

  // Show loading screen when data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show message when there are no deliveries
  if (!deliveries || deliveries.length === 0) {
    return (
      <div className="delivery-request-container">
        <h2 className="delivery-title">Order Request Status</h2>
        <p>No deliveries available.</p>
      </div>
    );
  }

  return (
    <div className="delivery-request-container">
      <h2 className="delivery-title">Order Request Status</h2>
      <img src={deliveryImage} alt="Delivery Illustration" className="delivery-image-res" />

      <div className="delivery-row-container">
        {deliveries.map((delivery, index) => (
          <div key={index} className="delivery-card">
            {/* Delivery Header */}
            <div className="delivery-card-header">
              <p className="delivery-accepted">
                Driver:{' '}
                <span className="driver-name">
                  {delivery.driverDetails ? `${delivery.driverDetails.firstName} ${delivery.driverDetails.lastName}` : 'Unknown Driver'}
                </span>{' '}
                accepted the order <span className="order-id">ID: {delivery._id}</span>
              </p>
            </div>

            {/* Order Details */}
            <div className="order-details-box">
              {/* Add check to make sure restaurants exist and are an array */}
              {Array.isArray(delivery.restaurants) && delivery.restaurants.length > 0 ? (
                delivery.restaurants.map((restaurant, idx) => (
                  <div key={idx} className="restaurant-details">
                    <h4>{restaurant.restaurantName}</h4>
                    <div className="restaurant-address">{delivery.deliveryAddress}</div>
                    <h5>Items Ordered:</h5>
                    <ul className="item-list">
                      {Array.isArray(restaurant.orderedItems) && restaurant.orderedItems.length > 0 ? (
                        restaurant.orderedItems.map((item, i) => (
                          <li key={i}>
                            {item.name} × {item.quantity} = LKR {item.price * item.quantity}
                          </li>
                        ))
                      ) : (
                        <li>No items ordered</li>
                      )}
                    </ul>
                    <div className="total-amount">Total: LKR {delivery.totalAmount}</div>
                  </div>
                ))
              ) : (
                <p>No restaurants found for this delivery.</p>
              )}
            </div>

            {/* Notify Section */}
            {!notifiedDeliveries.includes(index) ? (
              <div className="notify-box">
                <p className="notify-text">Notify driver for pickup</p>
                <button className="notify-button" onClick={() => handleNotify(index)}>
                  Notify
                </button>
              </div>
            ) : (
              <div className="driver-on-way-box">
                🚚 Driver is on the way for pickup!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryRequestStatus;
