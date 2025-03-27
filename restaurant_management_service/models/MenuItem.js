const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuItemSchema = new Schema(
  {
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    availability: { type: Boolean, default: true },
  },
  { timestamps: true }
);

var menuItem = mongoose.model('MenuItem', menuItemSchema);
module.exports = menuItem ;