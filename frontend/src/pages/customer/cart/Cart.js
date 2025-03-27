import React, { useState,useEffect  } from "react";
import "./Cart.css";
import DeleteIcon from "@mui/icons-material/Delete";

function Cart() {
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Beef Pizza", price: 12, quantity: 2, img: "pizza.png" },
    ]);

    const [selectedOrders, setSelectedOrders] = useState([]); // Store selected order IDs
    const [loading, setLoading] = useState(true);
    const userId = "user123"; // Replace with actual user ID logic

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                // Fetch only the orders for the current logged-in user
                const response = await fetch(`/api/cart/${userId}`);
                const data = await response.json();
                setCartItems(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching cart items:", error);
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [userId]);

    // Function to remove an item from the cart
    const removeItem = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
        setSelectedOrders(selectedOrders.filter((orderId) => orderId !== id)); // Remove from selection too
    };

    // Function to update the quantity
    const updateQuantity = (id, amount) => {
        setCartItems(
            cartItems.map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
            )
        );
    };

    // Function to select/deselect orders
    const handleSelectOrder = (id) => {
        if (selectedOrders.includes(id)) {
            setSelectedOrders(selectedOrders.filter((orderId) => orderId !== id)); // Remove if already selected
        } else {
            setSelectedOrders([...selectedOrders, id]); // Add new selection
        }
    };

    // Calculate total only for selected orders
    const selectedTotal = cartItems
        .filter((item) => selectedOrders.includes(item.id)) // Filter selected items
        .reduce((total, item) => total + item.price * item.quantity, 0);

    const deliveryFee = selectedOrders.length > 0 ? 300 : 0; // Apply delivery fee if items are selected
    const totalPrice = selectedTotal + deliveryFee;

    if (loading) {
        return <div>Loading...</div>; // Show loading state while fetching data
    }
    return (
        <div className="cart-container">
            <h2 className="cart-title">My Orders</h2>
            <div className="cart-items">
                {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                        {/* Checkbox - Allow multiple selections */}
                        <input
                            type="checkbox"
                            className="cart-checkbox"
                            checked={selectedOrders.includes(item.id)}
                            onChange={() => handleSelectOrder(item.id)}
                        />
                        <img src={`/images/${item.img}`} alt={item.name} className="cart-item-img" />
                        <div className="cart-item-details">
                            <span className="cart-item-name">{item.name}</span><br />
                            <span className="cart-item-price">LKR.{item.price.toFixed(2)}</span>
                        </div>
                        <div className="quantity-btn">
                            <button onClick={() => updateQuantity(item.id, -1)} className="quantity-btn">-</button>
                            <span className="quantity">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="quantity-btn">+</button>
                        </div>
                        {/* Remove Button */}
                        <button onClick={() => removeItem(item.id)} className="remove-btn">
                            <DeleteIcon />
                        </button>
                    </div>
                ))}
            </div>
            <br></br>
            {/* Total Calculation for Selected Orders */}
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

            <button className="checkout-button" disabled={selectedOrders.length === 0}>
                CHECK OUT
            </button>
        </div>
    );
}

export default Cart;
