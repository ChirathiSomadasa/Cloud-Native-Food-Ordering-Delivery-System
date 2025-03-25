const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'LKR'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    customerEmail: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    paymentReference: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);