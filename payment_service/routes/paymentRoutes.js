const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Initialize payment
router.post('/initiate', paymentController.validatePayment, paymentController.initiatePayment);

// Handle PayHere notification
router.post('/notify', paymentController.handleNotification);

// Get payment status
router.get('/status/:orderId', paymentController.getPaymentStatus);

module.exports = router;