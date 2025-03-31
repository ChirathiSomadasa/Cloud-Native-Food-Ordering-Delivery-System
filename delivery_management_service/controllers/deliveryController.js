const User = require('../models/User'); 
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');
const mongoose = require('mongoose');

// Create a new delivery entry when the user fills out the delivery form
exports.createDelivery = async (req, res) => {
  const { orderId, deliveryAddress, receiverName } = req.body;
  const userId = req.user.id; // Assumes the user is authenticated

  try {
    const order = await Order.findById(orderId).populate('restaurantId');
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const restaurant = order.restaurantId;
    const newDelivery = new Delivery({
      userId,
      restaurantId: restaurant._id,
      pickupLocation: restaurant.address,
      deliveryAddress,
      receiverName,
      orderId,
      deliveryStatus: 'accepted', // Initial status
      driverLocation: { lat: null, lng: null }, // Set default null for driver location
    });

    await newDelivery.save();
    res.status(201).json({ message: 'Delivery created successfully', delivery: newDelivery });
  } catch (err) {
    res.status(500).json({ error: 'Error creating delivery', err });
  }
};

// Get live tracking info for the customer (delivery status & driver location)
exports.getLiveTracking = async (req, res) => {
  const { deliveryId } = req.params;

  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    res.json({
      status: delivery.deliveryStatus,
      driverLocation: delivery.driverLocation,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching live tracking', err });
  }
};

// Mark food as ready for delivery (restaurant admin updates)
exports.markFoodReady = async (req, res) => {
  const { deliveryId } = req.body;

  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    delivery.deliveryStatus = 'picked-up'; // Status changed to "picked-up"
    await delivery.save();

    // Notify the driver or the user (this can be extended with real-time notifications)
    res.status(200).json({ message: 'Food is ready for delivery', delivery });
  } catch (err) {
    res.status(500).json({ error: 'Error marking food as ready', err });
  }
};
