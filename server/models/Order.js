// Define a order schema using Mongoose Schema
const mongoose = require("mongoose");

// Define the order schema with various fields
const orderSchema = new mongoose.Schema({
  // Purchase date of the order
  purchaseDate: {
    type: Date,
    default: Date.now,
  },

  // The 'Product' model of the order using its ObjectId
  products: [
    {
      type: mongoose.Schema.Types.ObjectId, // Use mongoose.Schema.Types.ObjectId
      ref: "Product",
    },
  ],
});

// Create a mongoose model named 'Order' based on the orderSchema
const Order = mongoose.model("Order", orderSchema);

// Export the Order model
module.exports = Order;
