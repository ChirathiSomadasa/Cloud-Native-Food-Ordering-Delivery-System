const express = require('express');
const { register, login,getAllUsers, deleteUser,logout,getUserDetails,updateUser,deleteUserAccount} = require('../controllers/authController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/all', verifyToken, verifyRole(['systemAdmin']), getAllUsers); // Get all users (only system admin)
router.delete('/delete/:id', verifyToken, verifyRole(['systemAdmin']), deleteUser); // Delete user (only system admin)

// Logout route
router.post('/logout', logout);

router.get('/me', verifyToken, getUserDetails); // Fetch user details (authenticated users only)

router.put('/update', verifyToken, updateUser); // Update user details (authenticated users only)

router.delete('/delete', verifyToken, deleteUserAccount); // Delete user account (authenticated users only)

module.exports = router;

