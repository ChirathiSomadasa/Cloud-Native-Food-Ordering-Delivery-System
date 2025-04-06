const express = require('express');
const upload = require('../middleware/uploadMiddleware'); // Import the upload middleware
const { addMenuItem, addMenuPhoto, updateMenuItem, deleteMenuItem} = require('../controllers/menuItemController');
const { verifyToken, verifyRole, verifyRestaurantStatus } = require('../middleware/authMiddleware');

const router = express.Router();

// Add a new menu item
router.post(
  '/add-menu-item',
  verifyToken,
  verifyRole(['restaurantAdmin']),
  verifyRestaurantStatus,
  addMenuItem
);

//Add a new menu photo
router.post(
    '/add-menu-photo',
    verifyToken,
    verifyRole(['restaurantAdmin']),
    upload.single('image'), // Middleware to handle image upload
    addMenuPhoto
  );
  

// Update a menu item
router.put(
  '/update/:id',
  verifyToken,
  verifyRole(['restaurantAdmin']),
  verifyRestaurantStatus,
  updateMenuItem
);

// Delete a menu item
router.delete(
  '/delete/:id',
  verifyToken,
  verifyRole(['restaurantAdmin']),
  verifyRestaurantStatus,
  deleteMenuItem
);

module.exports = router;