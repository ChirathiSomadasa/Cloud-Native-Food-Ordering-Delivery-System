const User = require('../models/User');
const Delivery = require('../models/Delivery');

// 📌 Accept Delivery (Driver accepts the delivery)
exports.acceptDelivery = async (req, res) => {
    try {
        const { orderId, driverId } = req.params;

        // Ensure the user is a driver
        const driver = await User.findById(driverId);
        if (!driver || driver.role !== 'deliveryPersonnel') {
            return res.status(400).json({ error: 'User is not a valid driver.' });
        }

        const order = await Delivery.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        order.driverId = driverId;
        order.deliveryStatus = 'accepted';
        await order.save();

        res.status(200).json({ message: 'Order accepted by driver', order });

    } catch (error) {
        res.status(500).json({ error: 'Failed to accept delivery', details: error.message });
    }
};

// 📌 Reject Delivery (Driver rejects the delivery)
exports.rejectDelivery = async (req, res) => {
    try {
        const { orderId, driverId } = req.params;

        // Ensure the user is a driver
        const driver = await User.findById(driverId);
        if (!driver || driver.role !== 'deliveryPersonnel') {
            return res.status(400).json({ error: 'User is not a valid driver.' });
        }

        const order = await Delivery.findById(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        // Revert the order to pending
        order.driverId = null;
        order.deliveryStatus = 'pending'; // Reassign to another driver
        await order.save();

        res.status(200).json({ message: 'Order rejected by driver', order });

    } catch (error) {
        res.status(500).json({ error: 'Failed to reject delivery', details: error.message });
    }
};

// 📌 Update Driver Location (Driver updates their current location)
exports.updateDriverLocation = async (req, res) => {
    try {
        const { driverId } = req.params;
        const { lat, lng } = req.body; // Lat/Lng from the driver's location

        // Ensure the user is a driver
        const driver = await User.findById(driverId);
        if (!driver || driver.role !== 'deliveryPersonnel') {
            return res.status(400).json({ error: 'User is not a valid driver.' });
        }

        driver.location = { type: 'Point', coordinates: [lng, lat] };
        await driver.save();

        res.status(200).json({ message: 'Driver location updated', driver });

    } catch (error) {
        res.status(500).json({ error: 'Failed to update driver location', details: error.message });
    }
};
