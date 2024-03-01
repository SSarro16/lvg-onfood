import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/Home";
import LogInPage, { action as authAction } from "./pages/LogIn";
import RootLayout from "./pages/RootLayout";
import { action as logoutAction } from "./pages/LogOut";
import { tokenLoader } from "./util/auth";
import NewProductPage from "./pages/NewProduct";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    id: "root",
    loader: tokenLoader,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LogInPage />,
        action: authAction,
      },
      { path: "logout", action: logoutAction },
      { path: "newproduct", element: <NewProductPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
