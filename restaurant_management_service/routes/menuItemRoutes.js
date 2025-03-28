const express = require('express');
const upload = require('../middleware/uploadMiddleware'); // Import the upload middleware
const { addMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuItemController');
const { verifyToken, verifyRole, verifyRestaurantStatus } = require('../middleware/authMiddleware');

const router = express.Router();

// Add a new menu item
router.post(
  '/add-menu-item',
  verifyToken,
  verifyRole(['restaurantAdmin']),
  verifyRestaurantStatus,
  upload.fields([
    { name: 'image', maxCount: 1 }, // Handle the image file
    { name: 'restaurantId', maxCount: 1 }, // Handle text fields
    { name: 'name', maxCount: 1 },
    { name: 'description', maxCount: 1 },
    { name: 'price', maxCount: 1 },
    { name: 'availability', maxCount: 1 },
  ]),
  addMenuItem
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