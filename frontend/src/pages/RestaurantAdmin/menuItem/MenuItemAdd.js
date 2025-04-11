import { useState } from "react";
import axios from "axios"; // For making API requests
import "./MenuItemAdd.css";

function MenuItemAdd() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    availability: true,
    image: null, // To store the selected image file
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      // If the input is a file, store the selected file
      setFormData((prevData) => ({
        ...prevData,
        image: files[0], // Store the first selected file
      }));
    } else if (type === "checkbox") {
      // Handle checkbox inputs
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      // Handle text, number, and textarea inputs
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Convert the image file to a base64 string
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // Read the file as a Data URL (base64)
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Retrieve the token
      const token = localStorage.getItem("auth_token"); // Use the correct key
      if (!token) {
        alert("Authentication token is missing. Please log in again.");
        return;
      }

      // Convert the image file to base64
      let imageData = "";
      if (formData.image) {
        imageData = await convertFileToBase64(formData.image);
      }

      // Prepare the request payload
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price), // Ensure price is a number
        availability: formData.availability,
        imageData: imageData, // Include the base64-encoded image
      };

      // Log the token and payload for debugging
      console.log("Token:", token);
      console.log("Request Payload:", payload);

      // Send the request to the backend
      const response = await axios.post(
        "http://localhost:5002/api/menu-items/add-menu-item",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
          },
        }
      );

      // Reset the form after successful submission
      setFormData({
        name: "",
        description: "",
        price: 0,
        availability: true,
        image: null,
      });

      alert("Menu item added successfully!");
    } catch (err) {
      console.error("Error adding menu item:", err.response?.data?.error || err.message);

      // Display specific error messages
      if (err.response?.status === 401) {
        alert("Authentication failed. Please log in again.");
      } else if (err.response?.status === 403) {
        alert("Access denied. You do not have permission to perform this action.");
      } else {
        setError(err.response?.data?.error || "An error occurred while adding the menu item.");
      }
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
              <label className="labelM" htmlFor="name">
                Item Name
              </label>
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