import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/Home";
import LogInPage, { action as authAction } from "./pages/LogIn";
import RootLayout from "./pages/RootLayout";
import { checkAuthLoader, tokenLoader } from "./util/auth";
import NewProductPage, { action as newproductAction } from "./pages/NewProduct";
import { action as logoutAction } from "./pages/LogOut";

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
      {
        path: "newproduct",
        element: <NewProductPage />,
        action: newproductAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
