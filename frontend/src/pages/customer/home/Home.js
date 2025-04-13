import React, { useEffect, useState } from 'react';
import './Home.css';
import HomeLandingPageImage from "../../../images/home_landing_img.jpg";

function Home() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    // Fetch menu items with restaurant names from the backend
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/menu-items/home-menu-items');
        if (!response.ok) {
          const errorText = await response.text(); // Get the error response as text
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }
        const data = await response.json();
        // Validate the data structure
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from the server.");
        }
        setFoodItems(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching menu items:", err.message);
        setError(err.message || "An unexpected error occurred.");
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, []);

  //Piumi
  const handleAddToCart = async (item) => {
    try {
      const token = localStorage.getItem("auth_token"); // Retrieve token from localStorage
      if (!token) {
        alert("You must be logged in to add items to the cart.");
        return;
      }
  
      const response = await fetch("http://localhost:5003/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` // Add the token here
        },
        body: JSON.stringify({
          itemId: item.id,
          name: item.name,
          price: item.price,
          img: item.image
        })
      });
  
      const data = await response.json();
      console.log("Sending item to cart:", item);
      console.log("Sending to backend:", {
        itemId: item.id, 
        name: item.name,
        price: item.price,
        img: item.image
      });
      
      if (response.ok) {
        alert("Added to cart!");
      } else {
        console.error(data);
        alert(data.error || "Failed to add item to cart.");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };
  
  
  //

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="highlight">Fast Delivery</span>
            <br />From Top Restaurants
          </h1>
          <p className="hero-description">
            Order your favorite meals from the best local restaurants and enjoy doorstep delivery in 30 minutes or less. Fresh, delicious food is just a few clicks away.
          </p>
          <button className="explore-button">
            Order Now <span className="arrow"> </span>
          </button>
        </div>
        <div className="hero-image">
          <img src={HomeLandingPageImage || "/placeholder.svg"} alt="Delicious food" />
        </div>
      </section>

      {/* Search Section */}
      <section className="search-section-h">
        <div className="search-container-h">
          <input 
            type="text" 
            className="search-input-h" 
            placeholder="Search for food, restaurants, or cuisines..." 
          />
          <button className="search-button-h">
            Search
          </button>
        </div>
      </section>

      {/* Trending Section */}
      <section className="trending-section">
        <div className="section-header">
          <h2 className="section-title">Tailored to your <span className="highlight">taste</span></h2>
          <button className="view-more-button">View more</button>
        </div>       
        <div className="food-grid">
          {foodItems.length > 0 ? (
            foodItems.map((item) => (
              <div className="food-card" key={item.id}>
                <div className="food-image">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} />
                </div>
                <div className="food-details">
                  <h3 className="food-name">{item.name}</h3>
                  <p className="restaurant-name">{item.restaurant || "Unknown Restaurant"}</p>
                  <p className="food-price">Rs.{(item.price || 0).toFixed(2)}</p>
                  <div className="description">
                    <p className="description-label">Description:</p>
                    <p className="description-text">{item.description || "No description available."}</p>
                  </div>
                  <button onClick={() => handleAddToCart(item)} className="add-to-cart-btn">Add to Cart</button>

                </div>
              </div>
            ))
          ) : (
            <div className="no-items">No menu items found.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;