import { useState } from "react";
import Sidebar from "./Sidebar";
import "./Header.css";


import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person"; 

function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
              <button className="text-button-login">Login</button>
              <button className="primary-button">Sign Up</button>
              <button className="text-button">Sign Out</button>
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
              <button className="text-button-login">Login</button>
              <button className="primary-button">Sign Up</button>
              <button className="text-button">Sign Out</button>
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