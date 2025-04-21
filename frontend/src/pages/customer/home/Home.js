import { useEffect, useState } from "react"
import "./Home.css"
import HomeLandingPageImage from "../../../images/home_landing_img.jpg"

function Home() {
  const [foodItems, setFoodItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`http://localhost:5004/api/menu-items/home-menu-items?page=${currentPage}&limit=6`)
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`)
        }
        const data = await response.json()

        // Validate the data structure
        if (!Array.isArray(data.data)) {
          throw new Error("Invalid data format received from the server.")
        }

        setFoodItems(data.data)
        setFilteredItems(data.data)
        setTotalPages(data.totalPages)

        // Extract unique restaurants
        const uniqueRestaurants = [...new Set(data.data.map((item) => item.restaurant))]
          .filter((restaurant) => restaurant) // Filter out null/undefined values
          .sort()

        setRestaurants(uniqueRestaurants)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching menu items:", err.message)
        setError(err.message || "An unexpected error occurred.")
        setLoading(false)
      }
    }
    fetchMenuItems()
  }, [currentPage])

  useEffect(() => {
    // Filter items when restaurant selection or search query changes
    let results = foodItems;
  
    if (selectedRestaurant) {
      results = results.filter((item) => item.restaurant === selectedRestaurant);
    }
  
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter((item) => {
        // Check if the search query matches the food name, description, restaurant name, or price
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDescription =
          item.description && item.description.toLowerCase().includes(query);
        const matchesRestaurant =
          item.restaurant && item.restaurant.toLowerCase().includes(query);
        const matchesPrice =
          item.price &&
          item.price.toString().toLowerCase().includes(query); // Convert price to string for comparison
  
        return matchesName || matchesDescription || matchesRestaurant || matchesPrice;
      });
    }
  
    setFilteredItems(results);
  }, [selectedRestaurant, searchQuery, foodItems]);

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
    window.dispatchEvent(new Event("cartUpdated")); // notify Header

  };


  //

  if (loading && currentPage === 1) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  // Handle pagination button clicks
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      setSelectedRestaurant(null) // Reset restaurant filter when changing page
    }
  }

  // Handle restaurant selection
  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant === selectedRestaurant ? null : restaurant)
  }

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

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
              Order your favorite meals from the best local restaurants and enjoy doorstep delivery in 30 minutes or
              less. Fresh, delicious food is just a few clicks away.
            </p>
            <button className="order-button-c">
              Order Now <span className="material-icons arrow-icon">arrow_forward</span>
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
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button className="search-button-h">Search</button>
          </div>
        </section>

        {/* Main Content with Restaurant Filter */}
        <div className="main-content">
          {/* Restaurant Filter Sidebar */}
          <aside className="restaurant-sidebar">
            <h3 className="sidebar-title">Restaurants</h3>
            <ul className="restaurant-list">
              <li
                className={`restaurant-item ${selectedRestaurant === null ? "active" : ""}`}
                onClick={() => handleRestaurantSelect(null)}
              >
                All Restaurants
              </li>
              {restaurants.map((restaurant, index) => (
                <li
                  key={index}
                  className={`restaurant-item ${selectedRestaurant === restaurant ? "active" : ""}`}
                  onClick={() => handleRestaurantSelect(restaurant)}
                >
                  {restaurant}
                </li>
              ))}
            </ul>
          </aside>

          {/* Trending Section */}
          <section className="trending-section">
            <div className="section-header">
              <h2 className="section-title">
                {selectedRestaurant ? (
                  <>
                    Menu from <span className="highlight">{selectedRestaurant}</span>
                  </>
                ) : (
                  <>
                    Tailored to your <span className="highlight">taste</span>
                  </>
                )}
              </h2>
            </div>
            <div className="food-grid">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
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
                    <button onClick={() => handleAddToCart(item)} className="add-to-cart-btn">Add to Cart</button>
                  </div>
                ))
              ) : (
                <div className="no-items">No menu items found.</div>
              )}
            </div>

            {/* Pagination Controls */}
            {!selectedRestaurant && (
              <div className="pagination">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default Home
