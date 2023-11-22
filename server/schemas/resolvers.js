// Import necessary modules and dependencies
const { User, Product, Category, Order } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");
const stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

// Define GraphQL resolvers
const resolvers = {
  // Query resolvers handle data fetching
  Query: {
    // Fetch all categories
    categories: async () => {
      return await Category.find();
    },

    // Fetch products based on optional category and name filters
    products: async (_parent, { category, name }) => {
      // Initialize an empty object to hold query parameters
      const params = {};

      // Check if the 'category' argument is provided
      if (category) {
        // If provided, add 'category' to the query parameters
        params.category = category;
      }

      // Check if the 'name' argument is provided
      if (name) {
        // If provided, add 'name' to the query parameters with a regular expression
        // This allows a case-insensitive partial match for product names
        params.name = {
          $regex: name,
          $options: "i", // 'i' option for case-insensitive matching
        };
      }

      // Use the Product model to find products that match the specified parameters
      // Populate the 'category' field to include category details in the result
      const foundProducts = await Product.find(params).populate("category");

      // Return the found products
      return foundProducts;
    },

    // Fetch a single product by ID
    product: async (_parent, { _id }) => {
      return await Product.findById(_id).populate("category");
    },

    // Fetch user data with orders, ordered by purchase date
    user: async (_parent, args, context) => {
      // Check if a user is authenticated (present in the context)
      if (context.user) {
        // Use the User model to find the authenticated user by ID
        const user = await User.findById(context.user._id)
          // Populate the 'orders.products' field to include product details in the result
          .populate({
            path: "orders.products",
            // Populate the 'category' field within each product to include category details
            populate: "category",
          });

        // Sort the user's orders by purchase date in descending order
        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

        // Return the user data with populated orders
        return user;
      }

      // Throw an authentication error if the user is not authenticated
      throw AuthenticationError;
    },

    // Fetch a specific order by ID
    order: async (_parent, { _id }, context) => {
      // Check if a user is authenticated (present in the context)
      if (context.user) {
        // Use the User model to find the authenticated user by ID
        const user = await User.findById(context.user._id)
          // Populate the 'orders.products' field to include product details in the result
          .populate({
            path: "orders.products",
            // Populate the 'category' field within each product to include category details
            populate: "category",
          });

        // Find and return the specific order from the user's orders based on the provided order ID
        const specificOrder = user.orders.id(_id);

        // Check if the specific order exists
        if (specificOrder) {
          // Return the specific order with product and category details
          return specificOrder;
        } else {
          // If the order with the provided ID is not found, throw an error
          throw new Error("Order not found");
        }
      }

      // Throw an authentication error if the user is not authenticated
      throw AuthenticationError;
    },

    // Handle checkout by creating a Stripe session for payment
    checkout: async (_parent, args, context) => {
      // Extract the origin URL from the request headers
      const url = new URL(context.headers.referer).origin;

      // Create a new order instance with the provided products
      const order = new Order({ products: args.products });
      const line_items = [];

      // Populate the products field of the order instance
      const { products } = await order.populate("products");

      // Create Stripe product and price objects for each product in the order
      for (let i = 0; i < products.length; i++) {
        // Create a new product on the Stripe platform
        const product = await stripe.products.create({
          name: products[i].name, // Set the product name
          description: products[i].description, // Set the product description
          images: [`${url}/images/${products[i].image}`], // Set the product image URL
        });

        // Create a new price for the product on the Stripe platform
        const price = await stripe.prices.create({
          product: product.id, // Use the ID of the created product
          unit_amount: products[i].price * 100, // Convert product price to cents
          currency: "usd", // Set the currency to US dollars
        });

        // Add the price ID and quantity to the line_items array
        line_items.push({
          price: price.id, // Add the ID of the created price
          quantity: 1, // Set the quantity to 1 (for one unit of the product)
        });
      }

      // Create a Stripe checkout session with line items and other details
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"], // Specify accepted payment methods ("card")
        line_items, // Provide the array of line items (products and prices)
        mode: "payment", // Set the mode to "payment" for a one-time payment
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`, // Redirect URL after a successful payment
        cancel_url: `${url}/`, // Redirect URL if the user cancels the payment process
      });

      // Return the session ID for the client to redirect to Stripe checkout
      return { session: session.id };
    },
  },

  // Mutation resolvers handle data modification
  Mutation: {
    // Add a new user to the database
    addUser: async (_parent, args) => {
      const user = await User.create(args);
      // Sign a JWT token for the new user
      const token = signToken(user);

      // Return the token and user data
      return { token, user };
    },

    // Add a new order to the user's orders
    addOrder: async (_parent, { products }, context) => {
      if (context.user) {
        // Create a new order instance
        const order = new Order({ products });
        // Update the user's document in the database by adding a new order
        await User.findByIdAndUpdate(context.user._id, {
          // Use the $push operator to add the new order to the 'orders' array
          $push: { orders: order }, // Adds the new order (contained in the 'order' variable) to the 'orders' array
        });

        // Return the newly created order
        return order;
      }

      // Throw an authentication error if the user is not authenticated
      throw AuthenticationError;
    },

    // Update user information
    updateUser: async (_parent, args, context) => {
      // Check if a user is authenticated (logged in)
      if (context.user) {
        // If authenticated, find and update the user document in the database
        // 'context.user._id' is the unique identifier of the authenticated user
        // 'args' contains the updated user information
        return await User.findByIdAndUpdate(context.user._id, args, {
          new: true, // 'new: true' option returns the modified user document after the update
        });
      }

      // Throw an authentication error if the user is not authenticated
      throw AuthenticationError;
    },

    // Update product quantity based on ID
    updateProduct: async (_parent, { _id, quantity }) => {
      // Calculate the decrement value for the product quantity
      const decrement = Math.abs(quantity) * -1;

      // Find and update the product document
      return await Product.findByIdAndUpdate(
        _id, // The unique identifier of the product to update
        { $inc: { quantity: decrement } }, // Use $inc to decrement the 'quantity' field by the specified value
        { new: true } // Option to return the modified product document after the update
      );
    },

    // User login verification
    login: async (_parent, { email, password }) => {
      // Find the user document with the provided email
      const user = await User.findOne({ email });

      // Throw an authentication error if the user is not found
      if (!user) {
        throw AuthenticationError;
      }

      // Verify the correctness of the provided password
      const correctPw = await user.isCorrectPassword(password);

      // Throw an authentication error if the password is incorrect
      if (!correctPw) {
        throw AuthenticationError;
      }

      // Sign a JWT token for the authenticated user
      const token = signToken(user);

      // Return the token and user data
      return { token, user };
    },
  },
};

// Export the resolvers object
module.exports = resolvers;
