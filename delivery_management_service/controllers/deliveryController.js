const Delivery = require('../models/Delivery');
const User = require('../models/User'); // Assuming user is both customer and driver
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');

// 📌 Place a new order (User → Restaurant)
// Since the order details are placed elsewhere, we only deal with the order ID here
exports.placeOrder = async (req, res) => {
    try {
        const { orderId } = req.params; // We get the orderId from the request
        const order = await Delivery.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // If the order is already in a 'delivered' or 'cancelled' state, prevent further actions
        if (order.deliveryStatus === 'delivered' || order.deliveryStatus === 'cancelled') {
            return res.status(400).json({ error: 'Order cannot be modified, it has already been completed or cancelled.' });
        }

        res.status(200).json({ message: 'Order retrieved successfully', order });

    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve order', details: error.message });
    }
};

// 📌 Assign the nearest driver (Restaurant → Drivers)
exports.assignDriver = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Fetch the order details
        const order = await Delivery.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Find nearest available drivers (Example based on status; further logic can be added)
        const availableDrivers = await Driver.find({ status: 'active' });

        if (availableDrivers.length === 0) {
            return res.status(404).json({ error: 'No available drivers nearby' });
        }

        // Assign the first available driver for now (can be enhanced with proximity calculation)
        const assignedDriver = availableDrivers[0];

        // Update the order with the assigned driver
        order.driverId = assignedDriver._id;
        order.deliveryStatus = 'pending'; // Set status to 'pending' when the driver is assigned
        await order.save();

        // Respond with the updated order details
        res.status(200).json({
            message: 'Driver assigned successfully',
            order,
            driver: assignedDriver,
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to assign driver', details: error.message });
    }
};

// 📌 Accept Delivery (Driver → Order)
exports.acceptDelivery = async (req, res) => {
    try {
        const { orderId, driverId } = req.params;

        const order = await Delivery.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Ensure the driver is valid and the driver is the one assigned to the order
        const driver = await User.findById(driverId);
        if (!driver || driver.role !== 'deliveryPersonnel') {
            return res.status(400).json({ error: 'Invalid driver' });
        }

        // Ensure that the driver is the one assigned to the order
        if (order.driverId.toString() !== driverId) {
            return res.status(400).json({ error: 'You are not assigned to this order' });
        }

        order.deliveryStatus = 'accepted';  // The order is accepted by the driver
        await order.save();

        res.status(200).json({ message: 'Order accepted by driver', order });

    } catch (error) {
        res.status(500).json({ error: 'Failed to accept delivery', details: error.message });
    }
};

// 📌 Reject Delivery (Driver → Order)
exports.rejectDelivery = async (req, res) => {
    try {
        const { orderId, driverId } = req.params;

        const order = await Delivery.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Ensure the driver is valid and the driver is the one assigned to the order
        const driver = await User.findById(driverId);
        if (!driver || driver.role !== 'deliveryPersonnel') {
            return res.status(400).json({ error: 'Invalid driver' });
        }

        // Ensure that the driver is the one assigned to the order
        if (order.driverId.toString() !== driverId) {
            return res.status(400).json({ error: 'You are not assigned to this order' });
        }

        // Revert the order back to pending and remove the driver
        order.driverId = null;
        order.deliveryStatus = 'pending';  // Reassign to another driver
        await order.save();

        res.status(200).json({ message: 'Order rejected by driver', order });

    } catch (error) {
        res.status(500).json({ error: 'Failed to reject delivery', details: error.message });
    }
};

// 📌 Mark Order as Ready (Restaurant → Driver)
exports.markOrderReady = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Delivery.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Check if the order is already accepted
        if (order.deliveryStatus !== 'accepted') {
            return res.status(400).json({ error: 'Order must be accepted by a driver before being marked ready' });
        }

        order.deliveryStatus = 'picked-up';  // Mark it as ready for pickup
        await order.save();

        res.status(200).json({ message: 'Food is ready for pickup', order });

    } catch (error) {
        res.status(500).json({ error: 'Failed to mark order as ready', details: error.message });
    }
};

// 📌 Notify User Order is On The Way (Driver → User)
exports.orderOnTheWay = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Delivery.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Ensure the order is marked as picked-up
        if (order.deliveryStatus !== 'picked-up') {
            return res.status(400).json({ error: 'Order must be marked as picked-up first' });
        }

        order.deliveryStatus = 'on-the-way';  // The driver is on the way to deliver
        await order.save();

        res.status(200).json({ message: 'Order is on the way', order });

    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status', details: error.message });
    }
};

// 📌 Track Live Driver Location (User → Tracking)
exports.trackDriver = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Delivery.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        res.status(200).json({ driverLocation: order.driverLocation });

    } catch (error) {
        res.status(500).json({ error: 'Failed to track driver', details: error.message });
    }
};

// 📌 Complete Order (Driver → User)
exports.completeOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Delivery.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        order.deliveryStatus = 'delivered';  // Mark the order as delivered
        await order.save();

        res.status(200).json({ message: 'Order delivered successfully', order });

    } catch (error) {
        res.status(500).json({ error: 'Failed to complete order', details: error.message });
    }
};
