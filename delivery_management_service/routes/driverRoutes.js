const express = require('express');
const {
  getAvailableDeliveries,
  acceptDelivery,
  declineDelivery,
  updateDriverLocation,
  getAllAssignedDeliveries,
  notifyDelivery,
  getAssignedDelivery,
  getReadyForPickupDelivery,
  updateDeliveryStatus,
  getDeliveryStatus,
  sendReceiptEmail,
} = require('../controllers/driverController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');


const router = express.Router();

// Route to get available deliveries (status: 'pending')
router.get('/available', verifyToken, verifyRole(['deliveryPersonnel']), getAvailableDeliveries);

// Route to accept a delivery
router.put('/accept', verifyToken, verifyRole(['deliveryPersonnel']), acceptDelivery);

// Route to decline a delivery
router.put('/decline', verifyToken, verifyRole(['deliveryPersonnel']), declineDelivery);

// Route to update the driver's location during delivery
// router.put('/update-location', verifyToken, verifyRole(['deliveryPersonnel']), updateDriverLocation);

router.get('/deliveries_res', verifyToken, verifyRole(['restaurantAdmin']), getAllAssignedDeliveries);

router.post('/notify_delivery/:deliveryId', notifyDelivery);

router.get('/deliveries-assigned', getAssignedDelivery);
// Add this route to get live driver location
// router.get('/location/:deliveryId', deliveryController.getDriverLocation);

router.get('/delivery-ready',getReadyForPickupDelivery);

// Update delivery status (picked-up, delivered, etc.)
router.put('/update-status/:deliveryId', updateDeliveryStatus);

// Update driver location
router.put('/delivery/:deliveryId/location',updateDriverLocation);

router.get('/delivery-status/:deliveryId', getDeliveryStatus);

router.post('/send-receipt/:deliveryId', sendReceiptEmail);


module.exports = router;
