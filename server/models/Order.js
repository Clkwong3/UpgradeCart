// Define a user schema using Mongoose Schema
const { Schema } = require("mongoose");

// Define the order schema with various fields
const orderSchema = new Schema({
  // Purchase date of the order
  purchaseDate: {
    type: Date,
    default: Date.now
  },

  // The 'Product' model of the order using its ObjectId
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]
});

// Create a mongoose model named 'Order' based on the orderSchema
const Order = mongoose.model('Order', orderSchema);

// Export the Order model for use in other files
module.exports = Order;
