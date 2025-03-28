const MenuItem = require("../models/MenuItem");
const upload = require("../middleware/uploadMiddleware");

exports.addMenuItem = [
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'restaurantId', maxCount: 1 },
    { name: 'name', maxCount: 1 },
    { name: 'description', maxCount: 1 },
    { name: 'price', maxCount: 1 },
    { name: 'availability', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { restaurantId, name, description, price, availability } = req.body;
      const imageUrl = req.files['image'] ? req.files['image'][0].path : null; // Get the uploaded image URL

      if (!restaurantId) {
        return res.status(400).json({ error: 'restaurantId is required' });
      }

      const menuItem = await MenuItem.create({
        restaurantId,
        name,
        description,
        price,
        availability,
        image: imageUrl, // Save the image URL in the database
      });

      res.status(201).json({ message: "Menu item added successfully", menuItem });
    } catch (err) {
      console.error("Error in addMenuItem:", err.message); // Log the error
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