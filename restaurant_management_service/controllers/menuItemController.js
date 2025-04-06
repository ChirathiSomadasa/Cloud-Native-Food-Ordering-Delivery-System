const MenuItem = require("../models/MenuItem");

// Add a new menu item
exports.addMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.create(req.body);
    res.status(201).json({ message: 'Menu item added successfully', menuItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMenuPhoto = [
  async (req, res) => {
    try {
      // Check if an image file was uploaded
      if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
      }

      // Get the uploaded image URL from Cloudinary
      const imageUrl = req.file.path;

      // Return the response with the image URL
      res.status(201).json({
        message: "Image uploaded successfully",
        imageUrl,
      });
    } catch (err) {
      console.error("Error in addMenuPhoto:", err.message); // Log the error
      res.status(500).json({ error: err.message });
    }
  },
];

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedMenuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item updated successfully', updatedMenuItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedMenuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};