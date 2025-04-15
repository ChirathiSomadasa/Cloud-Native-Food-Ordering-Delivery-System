import React, { useState,useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartUpdated, setCartUpdated] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Function to handle sign-out
  const handleSignOut = async () => {
    try {
      // Send a POST request to the backend to log out
      await axios.post(
        "http://localhost:5001/api/auth/logout", // Backend logout endpoint
        {},
        { withCredentials: true } // Include credentials (cookies)
      );

      // Clear any frontend-stored tokens 
      localStorage.removeItem("auth_token");

      // Redirect the user to the login page
      navigate("/login");
    } catch (err) {
      console.error("Error during sign-out:", err.response?.data?.error);
    }
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem("auth_token");
      if (!token) return;

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
      }
    };

    fetchCartItems();
    // Listen to cart updates globally
    const handleCartUpdate = () => {
      fetchCartItems(); // Refresh when event is triggered
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [cartUpdated]); // run effect when cartUpdated changes

  // Get the number of items in the cart
  const numberOfItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Left side - Menu icon, Logo, and name */}
          <div className="header-left">
            <button className="icon-button menu-button" onClick={toggleSidebar}>
              <MenuIcon />
            </button>
            <a href="/" className="logo-container">
              <div className="logo">FoodSprint</div>
            </a>
          </div>


          {/* Right side - Auth buttons and icons */}
          <div className="header-right">
            <div className="desktop-menu">
              <Link to="/register">
                <button className="primary-button">Sign Up</button>
              </Link>
              <Link to="/login">
                <button className="text-button-login">Login</button>
              </Link>
              <button className="text-button" onClick={handleSignOut}>
                Sign Out
              </button>
              <button className="icon-button profile-button">
                <PersonIcon />
              </button>
              <Link to="/cart">
                <button className="icon-button cart-button">
                  <ShoppingCartIcon />
                  <span className="badge">{numberOfItems}</span>
                </button>
              </Link>

              <button className="icon-button notification-button">
                <NotificationsIcon />
                <span className="badge">2</span>
              </button>
            </div>

            {/* Mobile icons */}
            <div className="mobile-menu">
              <button className="icon-button cart-button">
                <ShoppingCartIcon />
                <span className="badge">3</span>
              </button>
              <button className="icon-button notification-button">
                <NotificationsIcon />
                <span className="badge">2</span>
              </button>
              <button className="icon-button profile-button">
                <PersonIcon />
              </button>
              <Link to="/register">
                <button className="primary-button">Sign Up</button>
              </Link>
              <Link to="/login">
                <button className="text-button-login">Login</button>
              </Link>
              <button className="text-button" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </>
  );
}

export default Header;