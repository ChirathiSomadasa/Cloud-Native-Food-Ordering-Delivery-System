const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const objectId = Schema.ObjectId;

const orderSchema = new Schema(
    {
        id: objectId,
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
        items: {
            name: String,
            quantity: Number,
            price: Number
        },
        totalPrice: { type: Number, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Preparing', 'Ready'],
            default: 'Pending'
        }
    }, 
    { timestamps: true });

var order = mongoose.model("Order", orderSchema);
module.exports = order;