const Delivery = require('../models/Delivery');
const User = require('../../user_authentication_service/models/User');
const Order = require('../../order_management_service/models/Order');
const axios = require('axios'); 

// Get available deliveries for drivers (status: 'pending')
exports.getAvailableDeliveries = async (req, res) => {
  try {
    // Fetch pending deliveries from the delivery service
    const deliveries = await Delivery.find({ deliveryStatus: 'pending' });

    // For each delivery, fetch the related order data from the order management service
    const deliveriesWithOrderData = await Promise.all(
      deliveries.map(async (delivery) => {
        try {
          // Assuming the order service API is available at this URL and that the orderId is in delivery.orderId
          const orderResponse = await axios.get(`http://order-management-service/api/orders/${delivery.orderId}`);
          delivery.orderDetails = orderResponse.data; // Attach order details to the delivery object
        } catch (err) {
          delivery.orderDetails = null;  // In case there's an error, we'll set orderDetails to null
        }
        return delivery; // Return the updated delivery
      })
    );

    res.status(200).json({ deliveries: deliveriesWithOrderData });
  } catch (err) {
    res.status(500).json({
      error: 'Error fetching available deliveries',
      details: err.message
    });
  }
};
// Accept delivery
exports.acceptDelivery = async (req, res) => {
  const { deliveryId } = req.body;
  const driverId = req.user.id; // Assuming the driver is authenticated and their ID is in req.user.id

  try {
    // Find the driver from the User model
    const driver = await User.findById(driverId);
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Check if the driver is a 'deliveryPersonnel'
    if (driver.role !== 'deliveryPersonnel') {
      return res.status(403).json({ error: 'User is not authorized to accept deliveries' });
    }

    // Find the delivery by its ID
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    // Check if the delivery has already been accepted or declined
    if (delivery.deliveryStatus !== 'pending') {
      return res.status(400).json({ error: 'This delivery has already been accepted or declined' });
    }

    // If the delivery already has a driver assigned, prevent further updates
    if (delivery.driverId) {
      return res.status(400).json({ error: 'This delivery already has a driver assigned' });
    }

    // Assign the delivery to the driver
    delivery.driverId = driverId;
    delivery.deliveryStatus = 'accepted';

    // Save the updated delivery
    await delivery.save();

    res.status(200).json({ message: 'Delivery accepted successfully', delivery });
  } catch (err) {
    res.status(500).json({ error: 'Error accepting delivery', details: err.message });
  }
};

// Decline delivery
exports.declineDelivery = async (req, res) => {
  const { deliveryId } = req.body;

  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    if (delivery.deliveryStatus !== 'pending') {
      return res.status(400).json({ error: 'This delivery has already been accepted or declined' });
    }

    delivery.deliveryStatus = 'declined';
    await delivery.save();

    res.status(200).json({ message: 'Delivery declined', delivery });
  } catch (err) {
    res.status(500).json({ error: 'Error declining delivery', details: err.message });
  }
};

// Update driver location
exports.updateDriverLocation = async (req, res) => {
  const { deliveryId, lat, lng } = req.body;
  const driverId = req.user.id;

  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    // Check if the driver is assigned to the delivery
    if (!delivery.driverId || delivery.driverId.toString() !== driverId) {
      return res.status(403).json({ error: 'You are not assigned to this delivery' });
    }

    // Check if the delivery is in progress (accepted, picked-up, or on-the-way)
    if (!['accepted', 'picked-up', 'on-the-way'].includes(delivery.deliveryStatus)) {
      return res.status(400).json({ error: 'Cannot update location. Delivery is not in progress.' });
    }

    // Update the driver’s location
    delivery.driverLocation = { lat, lng };
    await delivery.save();

    res.status(200).json({
      message: 'Driver location updated',
      driverLocation: delivery.driverLocation
    });
  } catch (err) {
    res.status(500).json({ error: 'Error updating driver location', details: err.message });
  }
};

// Get current driver location
// exports.getDriverLocation = async (req, res) => {
//   const { deliveryId } = req.params;

//   try {
//     const delivery = await Delivery.findById(deliveryId);

//     if (!delivery) {
//       return res.status(404).json({ error: 'Delivery not found' });
//     }

//     if (!delivery.driverLocation) {
//       return res.status(404).json({ error: 'Driver location not yet available' });
//     }

//     res.status(200).json({
//       driverLocation: delivery.driverLocation,
//     });
//   } catch (err) {
//     res.status(500).json({
//       error: 'Error fetching driver location',
//       details: err.message
//     });
//   }
// };


// Real-time update via socket
exports.updateDriverLocationSocket = async (req, res) => {
  const { deliveryId, lat, lng } = req.body;
  const driverId = req.user.id;

  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    if (!delivery.driverId || delivery.driverId.toString() !== driverId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    delivery.driverLocation = { lat, lng };
    await delivery.save();

    // Emit the updated location to clients listening to this deliveryId
    global.io.emit(`driverLocationUpdate:${deliveryId}`, {
      deliveryId,
      lat,
      lng
    });

    res.status(200).json({ message: 'Driver location updated and broadcasted' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating location', details: err.message });
  }
};


// Controller to get all assigned deliveries
exports.getAllAssignedDeliveries = async (req, res) => {
  try {
    // Fetch all deliveries where a driver has been assigned (i.e., driverId is not null)
    const deliveries = await Delivery.find({ driverId: { $ne: null } }).populate('driverId', 'firstName lastName email phoneNumber'); // Populate driver details

    // Check if deliveries were found
    if (!deliveries || deliveries.length === 0) {
      return res.status(404).json({ message: 'No deliveries assigned to drivers.' });
    }

    // Respond with the list of deliveries
    return res.status(200).json(deliveries);
  } catch (error) {
    console.error('Error fetching assigned deliveries:', error);
    return res.status(500).json({ message: 'Failed to fetch assigned deliveries. Please try again.' });
  }
};

