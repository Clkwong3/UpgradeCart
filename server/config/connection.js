// Import the mongoose library
const mongoose = require('mongoose');

// Connect to the MongoDB database using the provided URI (Uniform Resource Identifier)
// If the process.env.MONGODB_URI variable is defined (e.g., in a production environment),
// use it as the URI; otherwise, use a default local URI for development purposes.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern-shopping');

// Export the mongoose connection object
module.exports = mongoose.connection;
