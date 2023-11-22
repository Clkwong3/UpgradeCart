// Import necessary dependencies from React and ReactDOM
import ReactDOM from "react-dom/client";
import "./index.css";

// Import routing components from react-router-dom
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import components for different pages
import App from "./App.jsx";
import Home from "./pages/Home";
import Detail from "./pages/Detail";
import NoMatch from "./pages/NoMatch";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Success from "./pages/Success";
import OrderHistory from "./pages/OrderHistory";

// Create a BrowserRouter instance with route configurations and define the routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    error: <NoMatch />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/success",
        element: <Success />,
      },
      {
        path: "/orderHistory",
        element: <OrderHistory />,
      },
      {
        path: "/products/:id",
        element: <Detail />,
      },
    ],
  },
]);

// Use ReactDOM.createRoot to render the app inside the root element
ReactDOM.createRoot(document.getElementById("root")).render(
  // Provide the router to the app using RouterProvider
  <RouterProvider router={router} />
);
