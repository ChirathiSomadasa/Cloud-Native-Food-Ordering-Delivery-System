import React, { useEffect, useState } from 'react';
import "./orderNotify.css";


const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          alert("Please log in to view your orders.");
          return;
        }

        // Step 1: Get restaurant ID
        const idRes = await fetch("http://localhost:5004/api/restaurants/get-restaurant-id/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!idRes.ok) throw new Error("Failed to fetch restaurant ID");
        const { restaurantId } = await idRes.json();
        console.log("Fetched restaurantId:", restaurantId);

        // Step 2: Get orders for the restaurant
        const orderRes = await fetch(`http://localhost:5003/api/order/restaurant/${restaurantId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!orderRes.ok) throw new Error("Failed to fetch orders");
        const orderData = await orderRes.json();
        console.log("Orders fetched:", orderData);

        if (Array.isArray(orderData)) {
          setOrders(orderData);
        } else if (Array.isArray(orderData.orders)) {
          setOrders(orderData.orders);
        } else {
          console.error("Unexpected orders format", orderData);
          setOrders([]);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
  <h2 className="orders-heading">My Orders</h2>

  {loading ? (
    <p>Loading orders...</p>
  ) : error ? (
    <p className="text-red-600">{error}</p>
  ) : orders.length === 0 ? (
    <p>No orders found for this restaurant.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="orders-table">
        <thead className="orders-thead">
          <tr>
            <th className="orders-th">Order ID</th>
            <th className="orders-th">Total</th>
            <th className="orders-th">Status</th>
            <th className="orders-th">Item Name</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} className="orders-tr">
              <td className="orders-td">{order._id}</td>
              <td className="orders-td">LKR.{order.totalPrice}</td>
              <td className="orders-td">
                <span
                  className={`status-badge ${
                    order.status === "Pending"
                      ? "status-pending"
                      : order.status === "Completed"
                      ? "status-completed"
                      : "status-cancelled"
                  }`}
                >
                  {order.status}
                </span>
              </td>
              <td className="orders-td">
                <ul className="item-list">
                  {order.itemDetails?.map((item, idx) => (
                    <li key={idx}>{item.name} × {item.quantity}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

  );
  
};

export default RestaurantOrders;
