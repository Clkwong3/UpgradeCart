// Import necessary React hooks and components
import { createContext, useContext, useReducer } from "react";

// Import the reducer function that defines how state changes in response to actions
import { reducer } from "./reducers";

// Create a context to hold the global state
const StoreContext = createContext();

// Destructure the 'Provider' from the context to use it later
const { Provider } = StoreContext;

// Define a provider component for the global state
const StoreProvider = ({ value = [], ...props }) => {
  // Use the useReducer hook to create a state and dispatch function based on the reducer function
  const [state, dispatch] = useReducer(reducer, {
    // Define the initial state of the application
    products: [], // Array to hold product data
    cart: [], // Array to hold items in the shopping cart
    cartOpen: false, // Boolean indicating whether the cart is open or closed
    categories: [], // Array to hold category data
    currentCategory: "", // String representing the currently selected category
  });

  // Return the provider with the state and dispatch function as the value
  return <Provider value={[state, dispatch]} {...props} />;
};

// Define a custom hook to easily access the global state and dispatch function
const useStoreContext = () => {
  return useContext(StoreContext);
};

// Export the provider and custom hook for use in other parts of the application
export { StoreProvider, useStoreContext };
