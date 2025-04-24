import React, { useEffect, useState } from 'react';
import "./orderNotify.css";
import { Trash2 } from "lucide-react";


const statusCycle = ["Pending", "Accepted", "Preparing", "Ready"];

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
                    setOrders(orderData.reverse());
                } else if (Array.isArray(orderData.orders)) {
                    setOrders(orderData.orders.reverse());
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

    const handleStatusClick = async (orderId, currentStatus) => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            alert("Please log in to update order status.");
            return;
        }

        const currentIndex = statusCycle.indexOf(currentStatus);
        const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];

        try {
            const res = await fetch(`http://localhost:5003/api/order/update-status/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: nextStatus })
            });

            const responseText = await res.text();
            console.log("Response from server:", responseText);

            if (!res.ok) throw new Error("Failed to update order status");

            setOrders(prev =>
                prev.map(order =>
                    order._id === orderId ? { ...order, status: nextStatus } : order
                )
            );
        } catch (err) {
            console.error("Status update error:", err);
            alert("Failed to update order status.");
        }
    };

    // Function to handle user deletion
    const handleDeleteOrder = async (orderId) => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            alert("Please log in to delete an order.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this order?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:5003/api/order/delete/${orderId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const responseText = await res.text();
            console.log("Delete response:", responseText);

            if (!res.ok) throw new Error("Failed to delete order");

            setOrders(prev => prev.filter(order => order._id !== orderId));
            alert("Order deleted successfully.");
        } catch (err) {
            console.error("Delete order error:", err);
            alert("Failed to delete the order.");
        }
    };

    return (
        <div className="manage-order-container">
            <h1 >My Orders</h1>

            {loading ? (
                <p>Loading orders...</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : orders.length === 0 ? (
                <p class="no-orders-message">No orders found for this restaurant.</p>
            ) : (
                <div className="table-order-container">
                    <table className="order-table">
                        <thead >
                            <tr>
                                <th >Order ID</th>
                                <th >Customer ID</th>
                                <th >Total</th>
                                <th >Item Name</th>
                                <th >Quantity</th>
                                <th >Status</th>
                                <th >Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} className="orders-tr">
                                    <td className="orders-td">{order._id}</td>
                                    <td className="orders-td">{order.customerId}</td>
                                    <td className="orders-td">LKR.{order.totalPrice}</td>
                                    <td className="orders-td">
                                        {order.itemName}
                                    </td>
                                    <td className="orders-td">{order.quantity}</td>
                                    <td className="orders-td">
                                        <span
                                            className={`status-badge ${order.status === "Pending"
                                                ? "status-pending"
                                                : order.status === "Accepted"
                                                    ? "status-Accepted"
                                                    : order.status === "Preparing"
                                                        ? "status-Preparing"
                                                        : order.status === "Ready"
                                                            ? "status-Ready"
                                                            : ""
                                                }`}
                                            onClick={() => handleStatusClick(order._id, order.status)}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="order-delete-btn"
                                            onClick={() => handleDeleteOrder(order._id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
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
