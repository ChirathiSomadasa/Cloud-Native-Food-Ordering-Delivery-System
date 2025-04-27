const express = require('express');
const router = express.Router();
const { createPayment, getPayment, updatePaymentStatus, capturePayPalDetails, getAllPayments, deletePayment } = require('../controllers/paymentController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware'); //check



// Create new payment  
router.post('/pay', verifyToken, verifyRole(['customer']), createPayment); //check
// Get payment by ID
router.get('/:id', verifyToken, verifyRole(['customer']), getPayment); //check
// Update payment status
router.patch('/payments/:id', updatePaymentStatus); //check but not needed??



// paypal payment details capture
router.post('/paypalDetails', verifyToken, capturePayPalDetails); //check
router.get('/all', verifyToken, verifyRole(['systemAdmin']), getAllPayments);
router.delete('/:id', verifyToken, verifyRole(['systemAdmin']), deletePayment);

module.exports = router;