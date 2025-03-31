const Delivery = require('../models/Delivery');
const User = require('../models/User');

// Get a list of available deliveries (status: 'pending') for the driver to accept or decline
exports.getAvailableDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ deliveryStatus: 'pending' })
      .populate('restaurantId')
      .populate('orderId');

    res.json({ deliveries });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching available deliveries', err });
  }
};

// Driver accepts a delivery
exports.acceptDelivery = async (req, res) => {
  const { deliveryId } = req.body;
  const driverId = req.user.id; // The authenticated driver

  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    if (delivery.deliveryStatus !== 'pending') {
      return res.status(400).json({ error: 'This delivery has already been accepted or declined' });
    }

    // Check if the driver is already assigned
    if (delivery.driverId) {
      return res.status(400).json({ error: 'This delivery already has a driver' });
    }

    // Update the delivery status to accepted and assign the driver
    delivery.driverId = driverId;
    delivery.deliveryStatus = 'accepted'; // Delivery is now accepted
    await delivery.save();

    // Notify the restaurant and customer (this could be done through real-time notifications in production)
    res.status(200).json({ message: 'Delivery accepted successfully', delivery });
  } catch (err) {
    res.status(500).json({ error: 'Error accepting delivery', err });
  }
};

// Driver declines a delivery
exports.declineDelivery = async (req, res) => {
  const { deliveryId } = req.body;

  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    if (delivery.deliveryStatus !== 'pending') {
      return res.status(400).json({ error: 'This delivery has already been accepted or declined' });
    }

    // Update the delivery status to declined
    delivery.deliveryStatus = 'declined'; // Delivery is now declined
    await delivery.save();

    // Notify the restaurant and customer (this could be done through real-time notifications in production)
    res.status(200).json({ message: 'Delivery declined', delivery });
  } catch (err) {
    res.status(500).json({ error: 'Error declining delivery', err });
  }
};

// Update driver location during delivery
exports.updateDriverLocation = async (req, res) => {
  const { deliveryId, lat, lng } = req.body;

  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    // Only allow updating the location if the driver has accepted the delivery
    if (delivery.deliveryStatus !== 'accepted') {
      return res.status(400).json({ error: 'Delivery not accepted yet' });
    }

    // Update the driver location in the delivery model
    delivery.driverLocation = { lat, lng };
    await delivery.save();

    res.status(200).json({ message: 'Driver location updated', driverLocation: delivery.driverLocation });
  } catch (err) {
    res.status(500).json({ error: 'Error updating driver location', err });
  }
};

