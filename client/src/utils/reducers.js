// Import action types/constants from actions.js
import {
  UPDATE_PRODUCTS,
  ADD_TO_CART,
  UPDATE_CART_QUANTITY,
  REMOVE_FROM_CART,
  ADD_MULTIPLE_TO_CART,
  UPDATE_CATEGORIES,
  UPDATE_CURRENT_CATEGORY,
  CLEAR_CART,
  TOGGLE_CART,
} from "./actions";

// Define the initial state of your application
const initialState = {
  products: [],
  cart: [],
  cartOpen: false,
  categories: [],
  currentCategory: "",
};

// Define the reducer function that handles state updates
export const reducers = (state = initialState, action) => {
  // Switch statement to handle different action types
  switch (action.type) {
    case UPDATE_PRODUCTS:
      // Action type: UPDATE_PRODUCTS
      // Update the products array with new data
      return {
        ...state, // Spread the current state to avoid mutation
        products: [...action.products], // Replace the products array with new data
      };

    case ADD_TO_CART:
      // Action type: ADD_TO_CART
      // Add a product to the cart
      return {
        ...state, // Create a new state object with the existing state properties
        cartOpen: true, // Set cartOpen to true to indicate that the cart is now open
        cart: [...state.cart, action.product], // Add the new product to the cart
      };

    case ADD_MULTIPLE_TO_CART:
      // Action type: ADD_MULTIPLE_TO_CART
      // Add multiple products to the cart
      return {
        ...state,
        cart: [...state.cart, ...action.products], // Add multiple products to the cart
      };

    case UPDATE_CART_QUANTITY:
      // Action type: UPDATE_CART_QUANTITY
      // Update the quantity of a product in the cart
      return {
        ...state,
        cartOpen: true,
        // Use map to create a new array based on the existing cart array
        cart: state.cart.map((product) => {
          // Check if the ID of the current product matches the ID passed in the action
          if (action._id === product._id) {
            // If there's a match, update the purchaseQuantity of the matching product
            product.purchaseQuantity = action.purchaseQuantity;
          }
          // Return the product, whether it's the one being updated or not
          return product;
        }),
      };

    case REMOVE_FROM_CART:
      // Action type: REMOVE_FROM_CART
      // Remove a product from the cart based on its ID
      // Use the filter method to create a new array excluding the product to be removed
      let newState = state.cart.filter((product) => {
        // Check if the ID of the current product does not match the ID passed in the action
        return product._id !== action._id;
      });

      // Update the state with the new cart array and determine if the cart should remain open
      return {
        ...state,
        // Set cartOpen to true if there are items in the new cart, otherwise set it to false
        cartOpen: newState.length > 0, // If there are items in the new cart, keep the cart open
        cart: newState, // Update the cart without the removed product, a new array (newState)
      };

    case CLEAR_CART:
      // Action type: CLEAR_CART
      // Clear the entire cart
      return {
        ...state,
        cartOpen: false, // Set cartOpen to false to indicate that the cart is now closed
        cart: [], // Set the cart to an empty array
      };

    case TOGGLE_CART:
      // Action type: TOGGLE_CART
      // Toggle the visibility of the cart
      return {
        ...state,
        cartOpen: !state.cartOpen, // Toggle the value of cartOpen
      };

    case UPDATE_CATEGORIES:
      // Action type: UPDATE_CATEGORIES
      // Update the categories array with new data
      return {
        ...state,
        categories: [...action.categories], // Replace the categories array with new data
      };

    case UPDATE_CURRENT_CATEGORY:
      // Action type: UPDATE_CURRENT_CATEGORY
      // Update the current category
      return {
        ...state,
        currentCategory: action.currentCategory, // Update the current category
      };

    default:
      // Default case: return the current state if the action type is not recognized
      return state;
  }
};
