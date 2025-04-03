const express = require('express');
const router = express.Router();
const {createPayment, getPayment, updatePaymentStatus, initializeOnlinePayment, handlePaymentNotification} = require('../controllers/paymentController');

// Create new payment
router.post('/payments', createPayment);

// Get payment by ID
router.get('/payments/:id', getPayment);

// Update payment status
router.patch('/payments/:id', updatePaymentStatus);

// Initialize online payment
router.post('/payments/initiate-online', initializeOnlinePayment);

// Handle payment notification
router.post('/payments/notify', handlePaymentNotification);

module.exports = router;