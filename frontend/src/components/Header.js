import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./Header.css";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios"; 
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate(); 

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
            <a href="/" className="logo-container">
              <div className="logo">FoodSprint</div>
            </a>
          </div>

          {/* Middle - Search bar */}
          <div className="search-container">
            <div className="search-bar">
              <SearchIcon className="search-icon" />
              <input
                type="search"
                placeholder="Search restaurants and foods..."
                className="search-input"
              />
            </div>
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
                <span className="badge">3</span>
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

        {/* Mobile search */}
        <div className="mobile-search">
          <div className="search-bar">
            <SearchIcon className="search-icon" />
            <input
              type="search"
              placeholder="Search restaurants and foods..."
              className="search-input"
            />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </>
  );
}

export default Header;