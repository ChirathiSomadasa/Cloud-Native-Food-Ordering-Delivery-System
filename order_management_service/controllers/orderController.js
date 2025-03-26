const mongoose = require("mongoose");
const Order = require('../models/Order');

//place a order
exports.placeOrder = async (req, res) => {
  try {
      console.log("Received order data:", req.body); // Debugging

      const { restaurantId, items, totalPrice } = req.body;
      if (!restaurantId || !items || items.length === 0 || !totalPrice) {
          return res.status(400).json({ error: "Invalid order data" });
      }

      const customerId = req.user?.id; // Ensure req.user exists
      if (!customerId) {
          return res.status(401).json({ error: "Unauthorized - No customer ID" });
      }

      const order = new Order({
          customerId,
          restaurantId,
          items,
          totalPrice,
          status: "Pending",
      });

      await order.save();
      res.status(201).json(order);
  } catch (error) {
      console.error("Error placing order:", error); // Log full error
      res.status(500).json({ error: "Error placing order" });
  }
};
/*example
{
  "restaurantId": "67e254ef9cfaba042d0d4e20",
  "items": [
    { "name": "String Hoppers", "quantity": 20, "price": 10 }
  ],
  "totalPrice": 200
}
*/

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

// Get all orders for a specific restaurant
exports.getOrdersForRestaurant = async (req, res) => {
  try {
    // Ensure the user is authenticated and has a restaurant ID
    if (!req.user || !req.user.restaurantId) {
      return res.status(400).json({ error: 'Restaurant ID is missing or user is unauthorized' });
    }

    // Fetch orders based on restaurantId from token
    const orders = await Order.find({ restaurantId: req.user.restaurantId });

    res.json(orders);
  } catch (error) {
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

/*
exports.updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { items, status } = req.body;

    // Check if orderId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    // Find the order by ID
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Ensure the authenticated customer is updating their own order
    if (order.customerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized to update this order" });
    }

    // Only allow updates if the order is still in 'Pending' status
    if (order.status !== "Pending") {
      return res.status(400).json({ error: "Order cannot be updated after being accepted" });
    }

    // Update order details if provided
    if (items) order.items = items;
    if (status) order.status = status;

    // Save updated order
    await order.save();
    res.json({ message: "Order updated successfully", order });

  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
*/