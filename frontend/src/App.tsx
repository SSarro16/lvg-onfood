import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/Home";
import LogInPage, { action as authAction } from "./pages/LogIn";
import RootLayout from "./pages/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LogInPage />, action: authAction },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
