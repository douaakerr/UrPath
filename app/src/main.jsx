import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

import "./style/index.css";

import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import ForgotPassword from "./pages/auth/ForgotPassword";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";

import Dashboard from "./pages/app/Dashboard";
import Roadmap from "./pages/app/Roadmap";
import SetUpLearning from "./pages/app/SetUpLearning";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "onboarding",
        element: <SetUpLearning />,
      },

      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: "dashboard",
                element: <Dashboard />,
              },
              {
                path: "roadmap",
                element: <Roadmap />,
              },
            ],
          },
          // Setup wizard routes — outside DashboardLayout (no sidebar/navbar)
          {
            path: "create-roadmap",
            element: <SetUpLearning />,
          },
          {
            path: "onboarding",
            element: <SetUpLearning />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
