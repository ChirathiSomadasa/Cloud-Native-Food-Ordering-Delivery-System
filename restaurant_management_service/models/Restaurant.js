const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const restaurantSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    OwnerName: { type: String, required: true },
    OwnerEmail: { type: String, required: true },
    OwnerMobileNumber: { type: String, required: true },
    ManagerName: { type: String, required: true },
    ManagerMobileNumber: { type: String, required: true },
    restaurantName: { type: String, required: true },
    address: { type: String, required: true },
    operatingHours: {
      Monday: { open: String, close: String },
      Tuesday: { open: String, close: String },
      Wednesday: { open: String, close: String },
      Thursday: { open: String, close: String },
      Friday: { open: String, close: String },
      Saturday: { open: String, close: String },
      Sunday: { open: String, close: String },
    },
    bankAccountDetails: {
      accountHolderName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      bankName: { type: String, required: true },
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

var restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = restaurant;
