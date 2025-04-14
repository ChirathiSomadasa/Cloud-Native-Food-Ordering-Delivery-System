const express = require('express');
const router = express.Router();
const {createPayment, getPayment, updatePaymentStatus, 
    initializeOnlinePayment, handlePaymentNotification} = require('../controllers/paymentController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware'); //check



// Create new payment  
router.post('/pay', verifyToken, verifyRole(['customer']), createPayment); //check

// Get payment by ID
router.get('/payments/:id', verifyToken, verifyRole(['customer']), getPayment); //check



// Update payment status
router.patch('/payments/:id', updatePaymentStatus); //check

// Initialize online payment
router.post('/payments/initiate-online', initializeOnlinePayment);

// Handle payment notification
router.post('/payments/notify', handlePaymentNotification);



module.exports = router;