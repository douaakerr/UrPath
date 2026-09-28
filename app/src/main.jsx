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
import Notifications from "./pages/app/Notifications";
import Profile from "./pages/app/Profile";
import AskAI from "./pages/app/AskAI";
import Focus from "./pages/app/Focus";
import Projects from "./pages/app/Projects";
import Landing from "./pages/public/Landing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Landing /> },
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
              { path: "focus", element: <Focus /> },
              { path: "projects", element: <Projects /> },
              { path: "courses", element: <Courses /> },
              { path: "courses/:courseId", element: <CourseDetails /> },
              { path: "progress", element: <Progress /> },
              { path: "quizzes", element: <Quizzes /> },
              { path: "quizzes/:quizId", element: <QuizDetails /> },
              { path: "notifications", element: <Notifications /> },
              { path: "profile", element: <Profile /> },
              { path: "ask-ai", element: <AskAI /> },
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
