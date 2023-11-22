// Define a product schema using Mongoose Schema
const { Schema } = require("mongoose");

// Create a new schema for the Product model
const productSchema = new Schema({
  // Name of the product
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Description of the product
  description: {
    type: String
  },
  // Image URL of the product
  image: {
    type: String
  },
  // Price of the product with a minimum value
  price: {
    type: Number,
    required: true,
    min: 0.99
  },
  // Quantity of the product with default value and minimum value
  quantity: {
    type: Number,
    min: 0,
    default: 0
  },
  // The 'Category' model of the product using its ObjectId
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
});

// Create a mongoose model named 'Product' based on the productSchema
const Product = mongoose.model('Product', productSchema);

// Export the Product model for use in other files
module.exports = Product;
