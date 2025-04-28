const Delivery = require('../models/Delivery');
const user = require('../../user_authentication_service/models/User');
const Order = require('../../order_management_service/models/Order');
const axios = require('axios'); 
const jwt = require('jsonwebtoken');


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
  const { deliveryId } = req.body; // You can ignore lat, lng from request if using constants
  const driverId = req.user.id;

  // Set the constant lat and lng values
  const lat = 6.9271; // Example constant latitude (e.g., for testing or static use)
  const lng = 79.8612; // Example constant longitude (e.g., for testing or static use)

  try {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

    // Check if the delivery belongs to the current driver
    if (!delivery.driverId || delivery.driverId.toString() !== driverId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update the driver's location with the constant lat, lng
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



// notifyDelivery controller
exports.notifyDelivery = async (req, res) => {
  const { deliveryId } = req.params;
  try {
    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    if (delivery.isNotified) {
      return res.status(400).json({ message: 'Driver already notified' });
    }

    // Update the delivery status and set notified flag
    delivery.isNotified = true;
    delivery.deliveryStatus = 'ready_for_pickup'; // Or any other logic
    await delivery.save();

    res.status(200).json({
      message: 'Driver notified successfully',
      delivery,
    });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({ message: 'Server error while notifying driver' });
  }
};



exports.getAssignedDelivery = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure token includes driver's id
    const driverId = decoded.id;

    // Find an assigned delivery for this driver that is not completed
    const delivery = await Delivery.findOne({
      driverId,
      deliveryStatus: { $ne: 'completed' },
    });

    if (!delivery) {
      return res.status(200).json({ delivery: null }); // No delivery found
    }

    // Include isReady flag for frontend
    const isReady = delivery.deliveryStatus === 'ready_for_pickup';

    res.status(200).json({ delivery, isReady });
  } catch (error) {
    console.error('Error getting assigned delivery:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReadyForPickupDelivery = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const driverId = decoded.id;

    const delivery = await Delivery.findOne({
      driverId,
      deliveryStatus: 'ready_for_pickup',
    });

    if (!delivery) {
      return res.status(200).json({ delivery: null });
    }

    res.status(200).json({ delivery });
  } catch (error) {
    console.error('Error fetching ready_for_pickup delivery:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Controller to update the status of a delivery
exports.updateDeliveryStatus = async (req, res) => {
  const { deliveryId } = req.params;
  const { deliveryStatus } = req.body;

  
  try {
    const delivery = await Delivery.findById(deliveryId);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    console.log('Before update, delivery status:', delivery.deliveryStatus);
    console.log('Received new status from client:', deliveryStatus);

    delivery.deliveryStatus = deliveryStatus;
    await delivery.save();

    console.log('Delivery status saved successfully');

    // Emit to all clients in this delivery room
    if (req.io) {
      req.io.to(deliveryId).emit('deliveryStatusUpdate', deliveryStatus);

      if (delivery.driverDetails?.location) {
        const { latitude, longitude } = delivery.driverDetails.location;
        req.io.to(deliveryId).emit('locationUpdate', {
          deliveryId,
          location: {
            lat: latitude,
            lng: longitude
          }
        });
      }
    }

    return res.status(200).json({
      message: `Delivery status updated to ${deliveryStatus}`,
      delivery
    });

  } catch (error) {
    console.error('Error updating delivery status:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};



// Update delivery status
// exports.updateDeliveryStatus = async (req, res) => {
//   const { deliveryId } = req.params;
//   const { status } = req.body;

//   try {
//     const delivery = await Delivery.findById(deliveryId);
//     if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

//     delivery.deliveryStatus = status;
//     await delivery.save();

//     // Emit to room
//     req.io.to(deliveryId).emit('statusUpdate', status);

//     res.json({ message: 'Delivery status updated', delivery });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



exports.getDeliveryStatus = async (req, res) => {
  try {
    // Find the most recently created delivery
    const delivery = await Delivery.findOne().sort({ createdAt: -1 });

    if (!delivery) {
      return res.status(404).json({ message: 'No deliveries found' });
    }

    // Check if the delivery object is valid before accessing its properties
    if (!delivery._id) {
      return res.status(400).json({ message: 'Invalid delivery data, missing _id' });
    }

    // Return the delivery status to the frontend
    return res.status(200).json({
      message: 'Most recent delivery status fetched successfully',
      delivery,
    });
  } catch (error) {
    console.error('Error fetching delivery status:', error);
    return res.status(500).json({ message: 'Server error while fetching delivery status' });
  }
};

// exports.sendReceiptEmail = async (req, res) => {
//   try {
//     const { deliveryId } = req.params;

//     const delivery = await Delivery.findById(deliveryId).populate('customerId');

//     if (!delivery) {
//       return res.status(404).json({ message: 'Delivery not found' });
//     }

//     const customerEmail = delivery.customerId.email;

//     const itemsHTML = delivery.restaurants.map(restaurant => {
//       const items = restaurant.orderedItems.map(item =>
//         `<li>${item.name} (x${item.quantity}) - $${item.price * item.quantity}</li>`
//       ).join('');
//       return `<h4>${restaurant.restaurantName}</h4><ul>${items}</ul>`;
//     }).join('');

//     const emailContent = `
//       <h2>Delivery Receipt</h2>
//       <p><strong>To:</strong> ${delivery.receiverName}</p>
//       <p><strong>Delivery Address:</strong> ${delivery.deliveryAddress}</p>
//       ${itemsHTML}
//       <p><strong>Delivery Fee:</strong> $${delivery.deliveryFee}</p>
//       <p><strong>Total:</strong> $${delivery.totalAmount}</p>
//       <p><strong>Estimated Time:</strong> ${delivery.estimatedDeliveryTime}</p>
//       <p><strong>Driver:</strong> ${delivery.driverDetails.firstName} ${delivery.driverDetails.lastName}</p>
//       <p>Thank you for using our service!</p>
//     `;

//     const transporter = nodemailer.createTransport({
//       service: 'Gmail',
//       auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: `"Delivery Service" <${process.env.SMTP_EMAIL}>`,
//       to: customerEmail,
//       subject: 'Your Delivery Receipt',
//       html: emailContent,
//     });

//     res.status(200).json({ message: 'Receipt sent successfully' });
//   } catch (error) {
//     console.error('Error sending receipt email:', error);
//     res.status(500).json({ message: 'Failed to send receipt email' });
//   }
// };









