// Define a user schema using Mongoose Schema
const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");

// Import the Order schema
const Order = require("./Order");

// Define the user schema with various fields
const userSchema = new Schema({
  // First name of the user
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  // Last name of the user
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  // Email address of the user (unique)
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Password of the user (hashed and with minimum length)
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  // Array to store user's orders using the Order schema
  orders: [Order.schema],
});

// Middleware: Execute before saving a user to hash the password
userSchema.pre("save", async function (next) {
  // Hash the password only if it's new or has been modified
  if (this.isNew || this.isModified("password")) {
    // Set the salt rounds for hashing
    const saltRounds = 10;
    // Hash the password using bcrypt
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  // Continue with the save operation
  next();
});

// Method to compare an incoming password with the user's hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  // Compare the provided password with the stored hashed password
  return await bcrypt.compare(password, this.password);
};

// Create a Mongoose model named 'User' using the userSchema
const User = mongoose.model("User", userSchema);

// Export the User model for use in other files
module.exports = User;
