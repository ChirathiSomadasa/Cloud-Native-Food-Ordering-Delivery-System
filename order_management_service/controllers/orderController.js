const Order = require('../models/Order');

//place a order
exports.placeOrder = async (req, res) => {
  try {
    const { customerId, restaurantId, items, totalPrice } = req.body;

    // Create a new order with the provided details
    const order = new Order({ customerId, restaurantId, items, totalPrice, status: 'Pending' });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error placing order' });
  }
};

// Get details of a specific order by its ID
exports.getOrder = async (req, res) => {
  try {
    // Find the order by its ID
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching order' });
  }
};

// Get orders for a specific restaurant based on restaurantId
exports.getOrdersForRestaurant = async (req, res) => {
  try {
    // Ensure the user has a valid restaurantId
    if (!req.restaurantId) {
      return res.status(400).json({ error: 'Restaurant ID is missing' });
    }

    // Fetch orders based on restaurantId
    const orders = await Order.find({ restaurantId: req.restaurantId });

    // If no orders are found, log and send an empty array
    if (orders.length === 0) {
      console.log("No orders found for this restaurant.");
    }

    // Send the orders as response
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: 'Error fetching orders' });
  }
};


// Update the status of an existing order
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Error updating order status' });
  }
};

// Cancel an existing order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'Pending') return res.status(400).json({ error: 'Cannot cancel confirmed order' });
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error cancelling order' });
  }
};
