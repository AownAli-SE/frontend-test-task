import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Categories from "./pages/Category.jsx";
import Car from "./pages/Cars.jsx";
import App from "./App.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PageNotFound from "./components/PageNotFound.jsx";
import InternalServerError from "./components/InternalServerError.jsx";
import Profile from "./pages/Profile.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <InternalServerError />,
    children: [
      { index: true, element: <Navigate to="/login" /> },
      { path: "login", errorElement: <InternalServerError />, element: <Login /> },
      { path: "signup", errorElement: <InternalServerError />, element: <Signup /> },
      { path: "forget-password", errorElement: <InternalServerError />, element: <ForgetPassword /> },
      {
        path: "dashboard",
        element: <ProtectedRoute Component={Dashboard} />,
        errorElement: <InternalServerError />,
        children: [
          { index: true, element: <Navigate to="categories" /> },
          { path: "profile", errorElement: <InternalServerError />, element: <Profile /> },
          { path: "categories", errorElement: <InternalServerError />, element: <Categories /> },
          { path: "cars", errorElement: <InternalServerError />, element: <Car /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
