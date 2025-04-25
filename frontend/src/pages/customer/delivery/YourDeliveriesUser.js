import React, { useEffect, useState } from 'react';
import './YourDeliveriesUser.css';
import deliveryImage from '../../../images/delivery/formdelivery.jpg';

const YourDeliveriesUser = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Authentication token is missing.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5008/delivery/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch deliveries');
        }

        if (data.deliveries) {
          setDeliveries(data.deliveries);
        } else {
          setError('No deliveries found.');
        }

      } catch (error) {
        console.error('Error fetching deliveries:', error);
        setError(error.message || 'Error fetching deliveries');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  return (
    <div className="your-deliveries-container">
      <h2 className="your-deliveries-title">Your Delivery Records</h2>

      {loading ? (
        <p>Loading deliveries...</p>
      ) : (
        <div className="your-deliveries-content">
          {error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : (
            <div className="delivery-list">
              {deliveries.length === 0 ? (
                <p>No deliveries found.</p>
              ) : (
                deliveries.map((delivery, index) => (
                  <div key={index} className="delivery-card">
                    <p><strong>Receiver Name:</strong> {delivery.receiverName}</p>
                    <p><strong>Address:</strong> {delivery.deliveryAddress}</p>
                    <p><strong>Restaurant:</strong> {delivery.restaurantName}</p>
                    <p><strong>Items:</strong></p>
                    <ul className="ordered-items-ul">
                      {delivery.orderedItems.map((item, i) => (
                        <li key={i}>
                          {item.name} × {item.quantity} = LKR {(item.price * item.quantity).toFixed(2)}
                        </li>
                      ))}
                    </ul>
                    <p><strong>Payment Amount:</strong> LKR {delivery.paymentAmount.toFixed(2)}</p>
                    <p><strong>Delivery Fee:</strong> LKR {delivery.deliveryFee.toFixed(2)}</p>
                    <p><strong>Total Amount:</strong> LKR {delivery.totalAmount.toFixed(2)}</p>
                    <p><strong>Distance:</strong> {delivery.distance} km</p>
                    <p><strong>Estimated Time:</strong> {delivery.estimatedDeliveryTime}</p>
                    <p><strong>Status:</strong> 
                      <span className={`status ${delivery.deliveryStatus}`}>
                        {delivery.deliveryStatus}
                      </span>
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="delivery-image">
            <img src={deliveryImage} alt="Delivery Visual" className="delivery-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default YourDeliveriesUser;
