const express = require('express');
const router = express.Router();
const DriverController = require('../controllers/driverController');

// 📌 Accept Delivery (Driver accepts the delivery)
// Route to accept a specific delivery by the driver
router.post('/acceptDelivery/:orderId/:driverId', DriverController.acceptDelivery);

// 📌 Reject Delivery (Driver rejects the delivery)
// Route to reject a specific delivery by the driver
router.post('/rejectDelivery/:orderId/:driverId', DriverController.rejectDelivery);

// 📌 Update Driver Location (Driver updates their current location)
// Route for the driver to update their location
router.post('/updateDriverLocation/:driverId', DriverController.updateDriverLocation);

module.exports = router;
