const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    pickupLocation: {
        type: String,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    deliveryStatus: {
        type: String,
        enum: ['pending', 'accepted', 'picked-up', 'on-the-way', 'delivered', 'cancelled'],
        default: 'pending'
    },
    estimatedDeliveryTime: {
        type: Number 
    },
    distance: {
        type: Number 
    },
    signature: {
        type: String
    },
    otp: {
        type: String,
        select: false,
        required: true
    },
    driverLocation: {
        lat: { type: Number },
        lng: { type: Number }
    }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
