// Define a user schema using Mongoose Schema
const mongoose = require("mongoose");

// Define the category schema
const categorySchema = new mongoose.Schema({
  // Name of the category
  name: {
    type: String,
    required: true,
    trim: true
  }
});

// Create a Mongoose model named 'Category' using the categorySchema
const Category = mongoose.model('Category', categorySchema);

// Export the Category model 
module.exports = Category;
