const mongoose = require('mongoose');
const user = require('../../user_authentication_service/models/User');
const Restaurant = require('../../restaurant_management_service/models/Restaurant');
const MenuItem = require('../../restaurant_management_service/models/MenuItem');
const Order = require('../../order_management_service/models/Order');
const Delivery = require('../models/Delivery');
const axios = require('axios');

// Create a new delivery
exports.createDelivery = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      receiverName,
      deliveryAddress,
      restaurantName,
      orderedItems,
      paymentStatus,
      paymentAmount,
      distance,
      estimatedDeliveryTime,
      deliveryFee,
      totalAmount,
      // driverLocation
    } = req.body;

    // Validate that the required fields are present
    if (
      !receiverName ||
      !deliveryAddress ||
      !orderedItems ||
      !paymentAmount ||
      !distance ||
      !deliveryFee ||
      !totalAmount
    ) {
      return res.status(400).json({ message: 'All fields are required.(2)' });
    }

    const customerId = req.user.id;

    // Automatically assign a driver (for simplicity, we fetch the first available delivery driver)
    // const availableDriver = await mongoose.model('user').findOne({
    //   role: 'deliveryPersonnel',
    //   currentDelivery: { $exists: false } // ensure driver is not already assigned to a delivery
    // }).exec();

    // if (!availableDriver) {
    //   return res.status(404).json({ message: 'No available driver found.' });
    // }

    // Create a new delivery document
    const newDelivery = new Delivery({
      customerId,
      receiverName,
      deliveryAddress,
      restaurantName,
      orderedItems,
      paymentStatus: paymentStatus || 'Paid',
      paymentAmount,
      distance,
      estimatedDeliveryTime,
      // driverId: availableDriver._id, // Assign the found driver
      deliveryFee,
      totalAmount,
      // driverLocation,
      deliveryStatus: 'pending', // Default status
    });

    // Save the new delivery to the database
    const savedDelivery = await newDelivery.save();

    // Respond with the saved delivery data
    return res.status(201).json({
      message: 'Delivery created successfully!',
      delivery: savedDelivery
    });
  } catch (error) {
    console.error('Error creating delivery:', error);
    return res.status(500).json({ message: 'Failed to create delivery. Please try again.' });
  }
};

//   try {
//     // 1. Fetch full order details
//     const { data: order } = await axios.get(
//       `http://localhost:5003/api/order/${orderId}`,
//       {
//         headers: { Authorization: req.headers.authorization }
//       }
//     );

//     if (!order || !order.items || order.items.length === 0) {
//       return res.status(400).json({ error: 'Invalid order or empty items list' });
//     }

//     // 2. Extract ordered items
//     const orderedItems = order.items.map(item => ({
//       name: item.name,
//       quantity: item.quantity,
//       price: item.price
//     }));

//     // 3. Calculate total item amount
//     const totalItemAmount = orderedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

//     // 4. Calculate delivery fee
//     const baseDeliveryFee = 200;
//     const extraDistance = Math.max(0, distance - 5);
//     const extraCharge = extraDistance * 25;
//     const deliveryFee = baseDeliveryFee + extraCharge;

//     const totalPrice = totalItemAmount + deliveryFee;

//     const fullName = receiverName || `${order.customerId?.first_name || ''} ${order.customerId?.last_name || ''}`.trim();

//     // 5. Create the delivery record
//     const newDelivery = new Delivery({
//       customerId,
//       deliveryAddress,
//       receiverName: fullName,
//       orderedItems,
//       totalItemAmount,
//       deliveryFee,
//       totalPrice,
//       paymentStatus: "Paid",
//       estimatedDeliveryTime,
//       distance,
//       deliveryStatus: 'pending',
//       driverLocation: { lat: null, lng: null }
//     });

//     await newDelivery.save();

//     res.status(201).json({
//       message: 'Delivery created successfully',
//       delivery: newDelivery
//     });

//   } catch (err) {
//     console.error('Error creating delivery:', err.message);
//     res.status(500).json({ error: 'Failed to create delivery', details: err.message });
//   }
// };


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
    res.status(500).json({ error: 'Error fetching live tracking', details: err.message });
  }
};

// Mark food as ready for delivery (restaurant admin updates)
exports.markFoodReady = async (req, res) => {
  const { deliveryId } = req.body;

  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    delivery.deliveryStatus = 'picked-up'; // Update status
    await delivery.save();

    res.status(200).json({ message: 'Food is ready and picked up for delivery', delivery });
  } catch (err) {
    res.status(500).json({ error: 'Error marking food as ready', details: err.message });
  }
};

// Get all deliveries for the currently logged-in user
exports.getDeliveriesForUser = async (req, res) => {
  try {
    // Get user ID from the token (already attached by the auth middleware)
    const userId = req.user.id;

    // Query the Delivery model for all deliveries for the logged-in user
    const deliveries = await Delivery.find({ customerId: userId });

    // If no deliveries are found, return an appropriate message
    if (deliveries.length === 0) {
      return res.status(404).json({ message: "No deliveries found for this user." });
    }

    // Respond with the deliveries
    res.status(200).json({ deliveries });
  } catch (err) {
    // If an error occurs, send a 500 error with the details
    console.error('Error fetching deliveries:', err.message);
    res.status(500).json({
      error: 'Failed to fetch user deliveries',
      details: err.message
    });
  }
};
