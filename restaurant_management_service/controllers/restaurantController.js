const Restaurant = require('../models/Restaurant');

// Register a new restaurant
exports.registerRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({ message: 'Restaurant registered successfully', restaurant });
  } catch (err) {
    res.status(500).json({ error: err.message });
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


// Fetch all restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    if (!restaurants || restaurants.length === 0) {
      return res.status(404).json({ message: 'No restaurants found' });
    }
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};