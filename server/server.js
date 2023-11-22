// Import necessary packages and modules
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const path = require("path");
const { authMiddleware } = require("./utils/auth");

// Load environment variables from .env file
require("dotenv").config();

// Import GraphQL schema and database connection
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");

// Set the port for the server to run on, default to 3001 if not provided
const PORT = process.env.PORT || 3001;

// Set the environment, default to 'development' if not provided
const NODE_ENV = process.env.NODE_ENV || "development";

// Create an Express application
const app = express();

// Create a new instance of an Apollo server with the GraphQL schema
const server = new ApolloServer({ typeDefs, resolvers });

// Async function to start the Apollo server
const startApolloServer = async () => {
  // Start the Apollo server
  await server.start();

  // Set up middleware for parsing URL-encoded and JSON data
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Serve static assets from the 'images' directory
  app.use("/images", express.static(path.join(__dirname, "../client/images")));

  // Set up GraphQL endpoint with authentication middleware
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  // Serve static assets and handle routes in production
  // This block will only execute if NODE_ENV is explicitly set to "production"
  if (NODE_ENV === "production") {
    // Serve static files from the 'dist' directory
    app.use(express.static(path.join(__dirname, "../client/dist")));

    // Handle all other routes by serving the 'index.html' file
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  } else {
    // This block will execute when NODE_ENV is not "production"
    console.log(
      `Running in ${NODE_ENV} environment. Static assets and routes may not be configured for this environment.`
    );
  }

  // Once the database connection is open, start the Express server
  db.once("open", () => {
    app.listen(PORT, () => {
      // Log a message indicating the server is running
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the server
startApolloServer();
