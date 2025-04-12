import React, { useEffect, useState } from 'react';
import './Home.css';
import HomeLandingPageImage from "../../../images/home_landing_img.jpg";

function Home() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Track the current page for pagination
  const [hasMore, setHasMore] = useState(true); // Track if there are more items to load

  useEffect(() => {
    // Fetch menu items with restaurant names from the backend
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`http://localhost:5002/api/menu-items/home-menu-items?page=${page}&limit=6`);
        if (!response.ok) {
          const errorText = await response.text(); // Get the error response as text
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }
        const data = await response.json();

        // Validate the data structure
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received from the server.");
        }

        // Check if there are more items to load
        if (data.length < 6) {
          setHasMore(false); // No more items to load
        }

        // Append new items to the existing list if not the first page
        if (page === 1) {
          setFoodItems(data); // Set initial items for the first page
        } else {
          setFoodItems((prevItems) => [...prevItems, ...data]); // Append new items
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching menu items:", err.message);
        setError(err.message || "An unexpected error occurred.");
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [page]); // Re-fetch when the page changes

  if (loading && page === 1) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Handle View More button click
  const handleViewMore = () => {
    setPage((prevPage) => prevPage + 1); // Increment the page number
  };

  return (
    <div className='customer-home'>
      <div className="home-container-c">
        {/* Hero Section */}
        <section className="hero-section-c">
          <div className="hero-content-c">
            <h1 className="hero-title-c">
              <span className="highlight-c">Fast Delivery</span>
              <br />From Top Restaurants
            </h1>
            <p className="hero-description-c">
              Order your favorite meals from the best local restaurants and enjoy doorstep delivery in 30 minutes or less. Fresh, delicious food is just a few clicks away.
            </p>
            <button className="order-button-c">
              Order Now <span className="arrow"> </span>
            </button>
          </div>
          <div className="hero-image-c">
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
            {hasMore && (
              <button className="view-more-button" onClick={handleViewMore}>
                View more
              </button>
            )}
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
                  </div>
                </div>
              ))
            ) : (
              <div className="no-items">No menu items found.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;