import { useState } from "react";
import axios from "axios"; // For making API requests
import "./MenuItemAdd.css";

function MenuItemAdd() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    availability: false,
    image: null, // To store the uploaded image file
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("restaurantId", localStorage.getItem("restaurantId"));
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("availability", formData.availability);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }
  
      console.log("FormData Keys:", [...formDataToSend.keys()]); // Log the keys
      console.log("FormData Values:", [...formDataToSend.values()]); // Log the values
  
      const response = await axios.post("/api/menu-items/add-menu-item", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      console.log(response.data.message);
      alert("Menu item added successfully!");
      setFormData({ name: "", description: "", price: 0, availability: false, image: null });
    } catch (err) {
      console.error("Frontend Error:", err.response?.data?.error || err.message); // Log the error
      setError(err.response?.data?.error || "An error occurred while adding the menu item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="menu-item-add-container">
      <div className="menu-item-add-header">
        <h2>Add New Menu Item</h2>
        <p>Create a new dish for your restaurant menu</p>
      </div>

      <form className="menu-item-form" onSubmit={handleSubmit}>
        <div className="form-layout">
          <div className="form-main">
            <div className="form-groupM">
              <label className="labelM" htmlFor="name">Item Name</label>
              <input
                className="inputM"
                type="text"
                id="name"
                name="name"
                placeholder="Enter menu item name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-groupM">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe the dish, ingredients, etc."
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-rowM">
              <div className="form-groupM">
                <label htmlFor="price">Price</label>
                <input
                  className="labelM"
                  type="number"
                  id="price"
                  name="price"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-groupM checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleChange}
                />
                <span className="checkmark"></span>
                <span>Available for ordering</span>
              </label>
            </div>
          </div>

          <div className="form-sidebar">
            <div className="image-upload-container">
              <label htmlFor="image">Item Image</label>
              <div className="image-preview">
                {formData.image && (
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "100px" }}
                  />
                )}
              </div>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="file-input"
                onChange={handleChange}
              />
              <label htmlFor="image" className="file-input-label">
                Choose Image
              </label>
              <p className="image-help-text">Recommended: 800x600px, JPG or PNG</p>
            </div>
          </div>
        </div>

        <div className="form-actions">
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Adding..." : "Add Menu Item"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MenuItemAdd;