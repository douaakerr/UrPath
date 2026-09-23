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
import Calendar from "./pages/app/Calendar";
import Courses from "./pages/app/Courses";
import CourseDetails from "./pages/app/CourseDetails";
import Progress from "./pages/app/Progress";
import Quizzes from "./pages/app/Quizzes";
import QuizDetails from "./pages/app/QuizDetails";
import FeaturePlaceholder from "./pages/app/FeaturePlaceholder";

const placeholderRoutes = [
  ["projects", "Projects", "Track the practical work you build along your path."],
  ["progress", "Progress", "See your completed work, activity and learning progress here."],
  ["ask-ai", "Ask UrPath AI", "Your learning assistant will be connected here."],
  ["profile", "Profile", "Manage your UrPath profile here."],
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: "dashboard", element: <Dashboard /> },
              { path: "roadmap", element: <Roadmap /> },
              { path: "calendar", element: <Calendar /> },
              { path: "courses", element: <Courses /> },
              { path: "courses/:courseId", element: <CourseDetails /> },
              { path: "progress", element: <Progress /> },
              { path: "quizzes", element: <Quizzes /> },
              { path: "quizzes/:quizId", element: <QuizDetails /> },
              ...placeholderRoutes.map(([path, title, description]) => ({
                path,
                element: <FeaturePlaceholder title={title} description={description} />,
              })),
            ],
          },
          { path: "create-roadmap", element: <SetUpLearning /> },
          { path: "onboarding", element: <SetUpLearning /> },
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
