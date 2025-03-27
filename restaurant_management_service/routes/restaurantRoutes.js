const express = require('express');
const {registerRestaurant,updateRestaurant,deleteRestaurant,verifyRestaurant,getAllRestaurants} = require('../controllers/restaurantController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const { validateRestaurantRegistration } = require('../middleware/validationMiddleware');

const router = express.Router();

// Register a new restaurant 
router.post('/register-restaurant',verifyToken,verifyRole(['restaurantAdmin']),validateRestaurantRegistration,registerRestaurant);

// Update restaurant details 
router.put('/update/:id', verifyToken, verifyRole(['restaurantAdmin']), updateRestaurant);

// Delete a restaurant 
router.delete('/delete/:id', verifyToken, verifyRole(['systemAdmin']), deleteRestaurant);

// Verify a restaurant
router.put('/verify-restaurant/:id', verifyToken, verifyRole(['systemAdmin']), verifyRestaurant);

// Fetch all restaurants
router.get('/get', verifyToken, verifyRole(['systemAdmin']), getAllRestaurants);

module.exports = router;