import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrders.css";
import { Trash2 } from "lucide-react";

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


  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      const token = localStorage.getItem('auth_token'); // assuming you store token in localStorage
      const response = await fetch(`http://localhost:5003/api/order/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert('Order cancelled successfully!');
        // After delete, you may want to refresh the order list:
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
      } else {
        // Check for specific error message
        if (data.error === 'Cannot cancel confirmed order') {
          alert('This order is already confirmed and cannot be cancelled.');
        } else {
          alert(data.error || 'Failed to cancel order');
        }
      }
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Something went wrong.');
      }
    };

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
                <button onClick={() => handleDelete(order._id)}><Trash2 size={20} color="#f4a405" /></button>
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
