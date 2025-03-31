const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        validate: {
            validator: async function(value) {
                const user = await mongoose.model('User').findById(value);
                return user && user.role === 'customer';
            },
            message: 'User must be a customer.'
        }
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        validate: {
            validator: async function(value) {
                const driver = await mongoose.model('User').findById(value);
                return driver && driver.role === 'deliveryPersonnel';
            },
            message: 'Driver must be a delivery personnel.'
        }
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
        enum: [ 'accepted','declined','proccessing', 'picked-up', 'on-the-way', 'delivered'],
        default: 'pending'
    },
    estimatedDeliveryTime: {
        type: Number 
    },
    distance: {
        type: Number 
    },
    driverLocation: {
        lat: { type: Number },
        lng: { type: Number }
    }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
