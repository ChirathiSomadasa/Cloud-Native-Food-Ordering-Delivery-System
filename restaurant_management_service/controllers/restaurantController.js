const Restaurant = require('../models/Restaurant');
const User = require('../../user_authentication_service/models/User');

// Register a new restaurant
exports.registerRestaurant = async (req, res) => {
  console.log("Received payload:", req.body); // Debugging line

  const { userId, OwnerName, OwnerEmail, OwnerMobileNumber, ManagerName, ManagerMobileNumber, restaurantName, address, operatingHours, bankAccountDetails } = req.body;

  try {
    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ error: "User ID is missing. Please register as a user first." });
    }

    console.log("User ID received in request body:", userId); // Add logging

    // Check if userId exists in the database
    const user = await User.findById(userId).maxTimeMS(30000);
    if (!user) {
      return res.status(400).json({ error: "Invalid User ID. Please register as a user first." });
    }

    const restaurant = await Restaurant.create({
      userId,
      OwnerName,
      OwnerEmail,
      OwnerMobileNumber,
      ManagerName,
      ManagerMobileNumber,
      restaurantName,
      address,
      operatingHours,
      bankAccountDetails
    });

    res.status(201).json({ message: 'Restaurant registered successfully', restaurant });
  } catch (err) {
    res.status(400).json({ error: err.message || "Invalid data provided" });
  }
};
// Update restaurant details
exports.updateRestaurant = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedRestaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant updated successfully', updatedRestaurant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a restaurant
exports.deleteRestaurant = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
    if (!deletedRestaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify a restaurant (Only System Admin)
exports.verifyRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Set isVerified to true
    restaurant.isVerified = true;
    await restaurant.save();

    res.json({ message: 'Restaurant verified successfully', restaurant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

