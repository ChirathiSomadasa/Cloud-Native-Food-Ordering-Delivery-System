import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Cart.css";
import DeleteIcon from "@mui/icons-material/Delete";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCartItems = async () => {
            const token = localStorage.getItem("auth_token");
            if (!token) {
                alert("Please log in to view your cart.");
                return;
            }

            try {
                const response = await fetch("http://localhost:5003/api/cart", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    const itemsWithQuantity = (data.items || []).map((item) => ({
                        ...item,
                        quantity: item.quantity || 1,
                    }));
                    setCartItems(itemsWithQuantity);
                } else {
                    console.error("Failed to fetch cart");
                }
            } catch (err) {
                console.error("Error fetching cart:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItems();
    }, []);

    const removeItem = async (id) => {
        const token = localStorage.getItem("auth_token");
        console.log("Attempting to remove item with ID:", id);

        try {
            const response = await axios.delete(`http://localhost:5003/api/cart/remove/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Remove item response:", response.data);

            // Update local state after successful deletion
            setCartItems((prev) => {
                const updated = prev.filter((item) => item._id !== id);
                console.log("Updated cartItems after delete:", updated);
                return updated;
            });

            setSelectedOrders((prev) => {
                const updated = prev.filter((orderId) => orderId !== id);
                console.log("Updated selectedOrders after delete:", updated);
                return updated;
            });
        } catch (error) {
            console.error("Error removing item:", error.response?.data || error.message);
            alert("Failed to remove item from cart.");
        }
    };

    // Update item quantity in the cart
    const updateQuantity = async (itemId, change) => {
        const item = cartItems.find((item) => item._id === itemId);
        const newQuantity = item.quantity + change;

        if (newQuantity <= 0) {
            alert("Quantity cannot be less than 1");
            return;
        }

        try {
            const token = localStorage.getItem("auth_token");
            const response = await axios.put(
                "http://localhost:5003/api/cart/update",
                { itemId, quantity: newQuantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Quantity updated:", response.data);

            // Update the local state with the new quantity
            setCartItems((prev) => {
                const updated = prev.map((item) =>
                    item._id === itemId ? { ...item, quantity: newQuantity } : item
                );
                return updated;
            });
        } catch (error) {
            console.error("Error updating quantity:", error.response ? error.response.data : error.message);
            alert("Failed to update quantity.");
        }
    };



    const clearCart = () => {
        setCartItems([]);
        setSelectedOrders([]);
    };



    const handleSelectOrder = (id) => {
        if (selectedOrders.includes(id)) {
            setSelectedOrders(selectedOrders.filter((orderId) => orderId !== id));
        } else {
            setSelectedOrders([...selectedOrders, id]);
        }
    };

    const handleCheckout = async () => {
        try {
            const selectedItems = cartItems.filter((item) =>
                selectedOrders.includes(item._id)
            );
            const token = localStorage.getItem("auth_token");
            const user = JSON.parse(localStorage.getItem("user"));

            const orderPayload = {
                userId: user?._id,
                items: selectedItems,
                totalAmount: totalPrice,
            };

            await axios.post("http://localhost:5003/api/order/add", orderPayload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Order placed successfully!");
            const remainingCart = cartItems.filter(
                (item) => !selectedOrders.includes(item._id)
            );
            setCartItems(remainingCart);
            setSelectedOrders([]);
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Failed to place order. Please try again.");
        }
    };

    const selectedTotal = cartItems
        .filter((item) => selectedOrders.includes(item._id))
        .reduce((total, item) => total + item.price * item.quantity, 0);

    const deliveryFee = selectedOrders.length > 0 ? 300 : 0;
    const totalPrice = selectedTotal + deliveryFee;

    if (loading) return <div>Loading...</div>;

    return (
        <div className="cart-container">
            <h2 className="cart-title">My Orders</h2>
            <button className="clear-cart-button" onClick={clearCart}>
                Clear Cart
            </button>

            <div className="cart-items">
                {cartItems.length === 0 ? (
                    <p className="empty-cart">Your cart is empty.</p>
                ) : (
                    cartItems.map((item) => (
                        <div key={item._id} className="cart-item">
                            <input
                                type="checkbox"
                                className="cart-checkbox"
                                checked={selectedOrders.includes(item._id)}
                                onChange={() => handleSelectOrder(item._id)}
                            />
                            <img
                                src={item.img.startsWith("http") || item.img.startsWith("/") ? item.img : `/images/${item.img}`}
                                alt={item.name}
                                className="cart-item-img"
                            />

                            <div className="cart-item-details">
                                <span className="cart-item-name">{item.name}</span>
                                <span className="cart-item-price">
                                    LKR.{item.price.toFixed(2)}
                                </span>
                            </div>
                            <div className="quantity-btn">
                                <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                                <span className="quantity">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                            </div>
                            <button
                                onClick={() => removeItem(item._id)}
                                className="remove-btn"
                            >
                                <DeleteIcon />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="cart-summary">
                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>LKR.{selectedTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                    <span>Delivery</span>
                    <span>LKR.{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                    <span>Total</span>
                    <span>LKR.{totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <button
                className="checkout-button"
                disabled={selectedOrders.length === 0}
                onClick={handleCheckout}
            >
                CHECK OUT
            </button>
        </div>
    );
}

export default Cart;
