const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = Schema.ObjectId;

const deliverySchema = new Schema({
  id: objectId,

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driverId: {
    type: String,
    required: true 
  },
  driverDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    }
  },

  // driverId: {
  //   type: objectId,
  //   ref: 'User',
  //   validate: {
  //     validator: async function (value) {
  //       const driver = await mongoose.model('User').findById(value);
  //       return driver && driver.role === 'deliveryPersonnel';
  //     },
  //     message: 'Driver must be a delivery personnel.'
  //   }
  // },

  receiverName: { type: String, required: true },
  deliveryAddress: { type: String, required: true },
  restaurants: [
    {
      restaurantName: { type: String, required: true }, // Restaurant name directly stored
      orderedItems: [
        {
          name: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, required: true },
        },
      ],
    },
  ],
    paymentStatus: { type: String, default: 'Paid' },
    paymentAmount: { type: Number, required: true },
    distance: { type: Number, required: true },
    estimatedDeliveryTime: { type: String, required: true },
    deliveryFee: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    deliveryStatus: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'processing', 'picked-up', 'on-the-way', 'delivered'],
        default: 'pending'
      },
      isNotified: {
        type: Boolean,
        default: false,
      },
      
      // driverLocation: {
      //   lat: { type: Number },
      //   lng: { type: Number }
      // },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const Delivery = mongoose.model('Delivery', deliverySchema);
module.exports = Delivery;
