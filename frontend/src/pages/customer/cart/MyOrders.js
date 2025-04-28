import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]); // For storing orders
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // For error messages

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          alert("Please log in to view your orders.");
          return;
        }

        const orderRes = await fetch(`http://localhost:5003/api/order/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!orderRes.ok) throw new Error("Failed to fetch orders");

        const ordersData = await orderRes.json();
        console.log("Orders fetched:", ordersData);

        if (Array.isArray(ordersData)) {
          setOrders(ordersData.reverse());
        } else {
          console.error("Unexpected orders format", ordersData);
          setOrders([]);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };


    fetchOrders();
  }, []);


  if (loading) return <div className="loading-message">Loading your orders...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="orders-container">
      <h2>Order Status Tracking Page</h2>
      {orders.length === 0 ? (
        <p class="no-orders-message">No orders placed yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-info">
              <p><strong>Item Name:</strong> {order.itemName}</p>
              <div className="order-status">
                <h3>Order Status: <span className="shipped"> {order.status}</span></h3>
              </div>
              <p><strong>Total Price:</strong> LKR {order.totalPrice.toFixed(2)}</p>
            </div>



            <div className="progress-tracker-wrapper-p">
              <div className="progress-line-bg-p" />
              <div
                className="progress-line-fill-p"
                style={{ width: `${["Pending", "Accepted", "Preparing", "Ready"].indexOf(order.status) / 3 * 100}%` }}
              />
              <div className="progress-tracker-p">
                <div className={`step ${["Pending", "Accepted", "Preparing", "Ready"].includes(order.status) ? "active" : ""}`}>
                  <div className="circle-p">✓</div>
                  <p>Pending</p>
                </div>
                <div className={`step ${["Accepted", "Preparing", "Ready"].includes(order.status) ? "active" : ""}`}>
                  <div className="circle-p">✓</div>
                  <p>Accepted</p>
                </div>
                <div className={`step ${["Preparing", "Ready"].includes(order.status) ? "active" : ""}`}>
                  <div className="circle-p">✓</div>
                  <p>Preparing</p>
                </div>
                <div className={`step ${["Ready"].includes(order.status) ? "active" : ""}`}>
                  <div className="circle-p">✓</div>
                  <p>Ready</p>
                </div>
              </div>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;
