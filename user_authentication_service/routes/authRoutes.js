const express = require('express');
const { register, login,getAllUsers, deleteUser} = require('../controllers/authController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/all', verifyToken, verifyRole(['systemAdmin']), getAllUsers); // Get all users (only system admin)
router.delete('/delete/:id', verifyToken, verifyRole(['systemAdmin']), deleteUser); // Delete user (only system admin)

module.exports = router;