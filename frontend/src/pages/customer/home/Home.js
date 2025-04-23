import React, { useEffect, useState } from "react";
import "./Home.css";
import HomeLandingPageImage from "../../../images/home_landing_img.jpg";

function Home() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Track the total number of pages

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          `http://localhost:5004/api/menu-items/home-menu-items?page=${currentPage}&limit=6`
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }
        const data = await response.json();

        // Validate the data structure
        if (!Array.isArray(data.data)) {
          throw new Error("Invalid data format received from the server.");
        }

        setFoodItems(data.data); // Set the fetched menu items
        setTotalPages(data.totalPages); // Set the total number of pages
        setLoading(false);
      } catch (err) {
        console.error("Error fetching menu items:", err.message);
        setError(err.message || "An unexpected error occurred.");
        setLoading(false);
      }
    };
    fetchMenuItems();
  }, [currentPage]); // Re-fetch when the current page changes

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
          img: item.image,
          restaurantId:item.restaurantId
        })
      });

      const data = await response.json();
      console.log("Sending to backend:", {
        itemId: item.id,
        name: item.name,
        price: item.price,
        img: item.image,
        restaurantId:item.restaurantId

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
    window.dispatchEvent(new Event("cartUpdated")); // notify Header

  };


  //

  if (loading && currentPage === 1) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Handle pagination button clicks
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="customer-home">
      <div className="home-container-c">
        {/* Hero Section */}
        <section className="hero-section-c">
          <div className="hero-content-c">
            <h1 className="hero-title-c">
              <span className="highlight-c">Fast Delivery</span>
              <br />
              From Top Restaurants
            </h1>
            <p className="hero-description-c">
              Order your favorite meals from the best local restaurants and enjoy doorstep delivery
              in 30 minutes or less. Fresh, delicious food is just a few clicks away.
            </p>
            <button className="order-button-c">
              Order Now <span className="arrow"></span>
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
            <button className="search-button-h">Search</button>
          </div>
        </section>

        {/* Trending Section */}
        <section className="trending-section">
          <div className="section-header">
            <h2 className="section-title">
              Tailored to your <span className="highlight">taste</span>
            </h2>
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

          {/* Pagination Controls */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;