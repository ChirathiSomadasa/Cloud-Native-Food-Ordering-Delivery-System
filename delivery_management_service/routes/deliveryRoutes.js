const express = require('express');
const router = express.Router();
const DeliveryController = require('../controllers/deliveryController');

// 📌 Place a new order (User → Restaurant)
// The user places an order by providing the orderId
router.get('/placeOrder/:orderId', DeliveryController.placeOrder);

// 📌 Assign the nearest driver (Restaurant → Drivers)
// Restaurant assigns a driver to a specific order
router.post('/assignDriver/:orderId', DeliveryController.assignDriver);

// 📌 Accept Delivery (Driver → Order)
// Driver accepts a specific delivery
router.post('/acceptDelivery/:orderId/:driverId', DeliveryController.acceptDelivery);

// 📌 Reject Delivery (Driver → Order)
// Driver rejects a specific delivery
router.post('/rejectDelivery/:orderId/:driverId', DeliveryController.rejectDelivery);

// 📌 Mark Order as Ready (Restaurant → Driver)
// Restaurant marks the order as ready for pickup
router.post('/markOrderReady/:orderId', DeliveryController.markOrderReady);

// 📌 Notify User Order is On The Way (Driver → User)
// Driver notifies that the order is on the way
router.post('/orderOnTheWay/:orderId', DeliveryController.orderOnTheWay);

// 📌 Track Live Driver Location (User → Tracking)
// User tracks the delivery driver's location
router.get('/trackDriver/:orderId', DeliveryController.trackDriver);

// 📌 Complete Order (Driver → User)
// Driver completes the delivery of the order
router.post('/completeOrder/:orderId', DeliveryController.completeOrder);

module.exports = router;
