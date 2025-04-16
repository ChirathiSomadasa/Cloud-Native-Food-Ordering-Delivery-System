import { useEffect } from "react";
import "./Sidebar.css";
import ProfileImage from "../images/profile.png";
import { Link } from "react-router-dom";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import CloseIcon from "@mui/icons-material/Close";

function Sidebar({ isOpen, onClose }) {
  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && e.target.classList.contains("sidebar-overlay")) {
        onClose();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="sidebar-wrapper">

      <div className="sidebar-overlay"></div>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">FoodSprint</div>
          <button className="sidebar-close-button" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="sidebar-content">
          {/* Profile section */}
          <div className="profile-section">
            <div className="profile-avatar">
              <img src={ProfileImage} alt="Profile" />
            </div>
            <div className="profile-info">
              <div className="profile-name">User Name</div>
              <a href="/account" className="manage-account" onClick={onClose}>
                Manage account
              </a>
            </div>
          </div>

          {/* Navigation */}
          <nav className="sidebar-nav">
          <Link to="/my-orders">
            <a href="/orders" className="sidebar-link" onClick={onClose}>
              <ListAltIcon />
              <span>Orders</span>
            </a>
            </Link>
            <a href="/cart" className="sidebar-link" onClick={onClose}>
              <ShoppingCartIcon />
              <span>Cart</span>
            </a>
            <a href="/notifications" className="sidebar-link" onClick={onClose}>
              <NotificationsIcon />
              <span>Notifications</span>
            </a>
            <a href="/deliveries/deliveryHome" className="sidebar-link" onClick={onClose}>
              <DeliveryDiningIcon />
              <span>Deliveries</span>
            </a>
          </nav>

          {/* Authentication Buttons */}
          <div className="auth-buttons">
            <Link to="/register"><button className="primary-button" onClick={onClose}>
              Sign Up
            </button>
            </Link>
            <Link to="/login">
            <button className="text-button-login" onClick={onClose}>
              Login
            </button>
            </Link>

          </div>

          {/* Sign out */}
          <div className="sidebar-section">
            <div className="divider"></div>
            <button className="sidebar-button" onClick={onClose}>
              <ExitToAppIcon />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;