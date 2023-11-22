// Import the necessary modules
const models = require("../models");
const db = require("../config/connection");

// Define an asynchronous function that takes the model name and collection name as parameters
module.exports = async (modelName, collectionName) => {
  try {
    // Check if the specified collection already exists in the MongoDB database
    // Access the MongoDB database associated with the specified model
    let modelExists = await models[modelName].db.db
      // Use the listCollections method to retrieve information about collections in the database
      .listCollections({
        name: collectionName, // Specify the name of the collection to check
      })
      .toArray(); // Convert the result to an array for further examination

    // If the collection exists, drop (delete) the collection
    // Check if the length of the 'modelExists' array is greater than 0
    if (modelExists.length) {
      await db.dropCollection(collectionName); // Use the 'db.dropCollection' method to delete the specified collection
    }
  } catch (err) {
    throw err; // If an error occurs, throw the error
  }
};
