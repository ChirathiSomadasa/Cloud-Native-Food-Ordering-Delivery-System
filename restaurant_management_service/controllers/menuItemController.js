const MenuItem = require("../models/MenuItem");
const cloudinary = require('../config/cloudinaryConfig');

// Add a new menu item with an image
exports.addMenuItem = async (req, res) => {
  try {
    // Extract image data from the request body
    const { imageData } = req.body;

    // Validate that image data is provided
    if (!imageData) {
      return res.status(400).json({ error: 'Image data is required in the request body' });
    }

    // Upload the base64-encoded image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(imageData, {
      folder: 'menu-items', // Folder in Cloudinary to store images
      format: 'jpg', // Convert all images to JPG
      public_id: `${Date.now()}`, // Unique filename
    });

    // Create the menu item with the uploaded image URL
    const menuItemData = {
      ...req.body,
      image: uploadResponse.secure_url, // Store the image URL
    };

    // Remove the imageData from the request body before saving
    delete menuItemData.imageData;

    // Create the menu item
    const menuItem = await MenuItem.create(menuItemData);

    res.status(201).json({ message: 'Menu item added successfully', menuItem });
  } catch (err) {
    console.error("Error in addMenuItem:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if an image is being updated
    const { imageData } = req.body;

    let updatedMenuItemData = { ...req.body };

    // Find the existing menu item
    const existingMenuItem = await MenuItem.findById(id);
    if (!existingMenuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // If image data is provided, upload the new image to Cloudinary
    if (imageData) {
      // Upload the new image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(imageData, {
        folder: 'menu-items', // Folder in Cloudinary to store images
        format: 'jpg', // Convert all images to JPG
        public_id: `${Date.now()}`, // Unique filename
      });

      // Store the new image URL
      updatedMenuItemData.image = uploadResponse.secure_url;

      // Remove the imageData from the request body before saving
      delete updatedMenuItemData.imageData;

      // Delete the old image from Cloudinary
      if (existingMenuItem.image) {
        // Extract the public_id from the old image URL
        const oldImagePublicId = existingMenuItem.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(oldImagePublicId);
      }
    }

    // Update the menu item
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(id, updatedMenuItemData, { new: true });

    res.json({ message: 'Menu item updated successfully', updatedMenuItem });
  } catch (err) {
    console.error("Error in updateMenuItem:", err.message); 
    res.status(500).json({ error: err.message });
  }
};

// Delete a menu item
exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the menu item to delete
    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // If the menu item had an image, delete it from Cloudinary
    if (menuItem.image) {
      // Extract the public_id from the image URL
      const imagePublicId = menuItem.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(imagePublicId);
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.error("Error in deleteMenuItem:", err.message); 
    res.status(500).json({ error: err.message });
  }
};


// Fetch menu items with restaurant name for the Home page
exports.getMenuItemsWithRestaurantName = async (req, res) => {
  try {
    // Fetch all menu items and populate the restaurant name
    const menuItems = await MenuItem.find()
      .populate("restaurantId", "restaurantName") // Populate only the 'restaurantName' field of the restaurant
      .exec();

    if (!menuItems || menuItems.length === 0) {
      return res.status(404).json({ message: "No menu items found" });
    }

    // Format the response to include restaurant name
    const formattedMenuItems = menuItems.map((item) => ({
      id: item._id,
      name: item.name,
      restaurant: item.restaurantId ? item.restaurantId.restaurantName : "Unknown Restaurant",
      image: item.image,
      price: item.price,
      description: item.description,
    }));

    res.status(200).json(formattedMenuItems);
  } catch (err) {
    console.error("Error fetching menu items:", err.message);
    res.status(500).json({ error: err.message });
  }
};