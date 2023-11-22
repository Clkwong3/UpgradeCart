// Import the GraphQL type definitions from the 'typeDefs' file
const typeDefs = require("./typeDefs");

// Import the GraphQL resolvers from the 'resolvers' file
const resolvers = require("./resolvers");

// Export an object containing the type definitions and resolvers
module.exports = { typeDefs, resolvers };
