const mongoose = require('mongoose');
const User = require('../../user_authentication_service/models/User');
const Restaurant = require('../../restaurant_management_service/models/Restaurant');
const MenuItem = require('../../restaurant_management_service/models/MenuItem');
const Order = require('../../order_management_service/models/Order');
const Delivery = require('../models/Delivery');
const axios = require('axios');


// Create a new delivery entry when the user fills out the delivery form
exports.createDelivery = async (req, res) => {
  const {
    orderId,
    deliveryAddress,
    receiverName,
    estimatedDeliveryTime,
    distance
  } = req.body;

  const customerId = req.user.id;

  try {
    // 1. Fetch order from order microservice
    const { data: order } = await axios.get(
      `http://localhost:5003/api/order/${orderId}`,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );

    if (!order || !order.itemId || order.itemId.length === 0) {
      return res.status(400).json({ error: 'Order or items not found' });
    }

     // 2. Fetch the first MenuItem by its ID (from order.itemId[0])
//      const menuItemId = order.itemId[0];
// console.log("Fetching MenuItem for ID:", menuItemId);
// const menuItem = await MenuItem.findById(menuItemId);

// if (!menuItem) {
//   console.error(`MenuItem not found for ID: ${menuItemId}`);
//   return res.status(400).json({ error: 'MenuItem not found' });
// }

// console.log("Fetched MenuItem:", menuItem);

// if (!menuItem.restaurantId) {
//   console.error(`MenuItem ${menuItemId} is missing restaurantId`);
//   return res.status(400).json({ error: 'Restaurant ID not found in menu item' });
// }

// console.log("Restaurant ID:", menuItem.restaurantId);

//     // 3. Fetch restaurant details to get the address
//     const restaurant = await Restaurant.findById(restaurantId);
//     if (!restaurant || !restaurant.address) {
//       return res.status(400).json({ error: 'Restaurant address not found' });
//     }

//     const pickupLocation = restaurant.address;

    // 4. Create the Delivery
    const fullName = `${order.customerId?.first_name || ''} ${order.customerId?.last_name || ''}`.trim();

    const newDelivery = new Delivery({
      customerId,
      // RestaurantId: menuItemId, // This is still the MenuItem _id
      deliveryAddress,
      receiverName: receiverName || fullName,
      orderId,
      // itemId: order.itemId.map(item => item._id), // array of menu item IDs
      totalPrice: order.totalPrice,
      quantity: order.quantity,
      // pickupLocation,
      estimatedDeliveryTime,
      distance,
      deliveryStatus: 'pending',
      driverLocation: { lat: null, lng: null }
    });

    await newDelivery.save();
    res.status(201).json({ message: 'Delivery created successfully', delivery: newDelivery });

  } catch (err) {
    console.error('Error creating delivery:', err.message);
    res.status(500).json({ error: 'Failed to create delivery', details: err.message });
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
