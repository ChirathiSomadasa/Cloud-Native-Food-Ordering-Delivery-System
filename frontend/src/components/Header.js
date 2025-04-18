import React, { useState } from "react";
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

  // Check if the user is logged in by verifying the presence of the auth token
  const isLoggedIn = !!localStorage.getItem("auth_token");

  // Decode the JWT token to get the user's role
  const getUserRole = () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode the payload
        return decodedToken.role || "customer"; // Default to "customer" if role is missing
      }
      return "customer"; // Default role for non-logged-in users
    } catch (err) {
      console.error("Error decoding token:", err);
      return "customer";
    }
  };

  const userRole = getUserRole();

  // Determine the home route based on the user's role
  const getHomeRoute = () => {
    switch (userRole) {
      case "restaurantAdmin":
        return "/restaurant-home";
      case "deliveryPersonnel":
        return "/delivery-home";
      case "systemAdmin":
        return "/admin-home";
      default:
        return "/"; // Default to customer home
    }
  };

  const homeRoute = getHomeRoute();

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

  return (
    <>
      <header className="header">
        <div className="header-container">
          {/* Left side - Menu icon, Logo, and name */}
          <div className="header-left">
            <button className="icon-button menu-button" onClick={toggleSidebar}>
              <MenuIcon />
            </button>
            <Link to={homeRoute} className="logo-container">
              <div className="logo">FoodSprint</div>
            </Link>
          </div>

          {/* Right side - Auth buttons and icons */}
          <div className="header-right">
            {isLoggedIn ? (
              // Buttons to display when the user is logged in
              <>
                <button className="icon-button profile-button">
                  <PersonIcon />
                </button>
                <button className="icon-button cart-button">
                  <ShoppingCartIcon />
                  <span className="badge">3</span>
                </button>
                <button className="icon-button notification-button">
                  <NotificationsIcon />
                  <span className="badge">2</span>
                </button>
                <button className="text-button" onClick={handleSignOut}>
                  Sign Out
                </button>
              </>
            ) : (
              // Buttons to display when the user is not logged in
              <>
                <Link to="/register">
                  <button className="primary-button">Sign Up</button>
                </Link>
                <Link to="/login">
                  <button className="text-button-login">Login</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </>
  );
}

export default Header;