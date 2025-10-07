import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LogInPage from "./pages/LogIn";
import HomePage from "./pages/Home";
import RootLayout from "./pages/RootLayout";
import NewProductPage from "./pages/NewProduct";
import { PrimeReactProvider } from "primereact/api";
import { tokenLoader } from "./util/auth";
import { ProductsProvider } from "./store/context/products-context";

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
      },
      {
        path: "newproduct",
        element: <NewProductPage />,
      },
    ],
  },
]);

function App() {
  return (
    <PrimeReactProvider>
      <ProductsProvider>
        <RouterProvider router={router} />
      </ProductsProvider>
    </PrimeReactProvider>
  );
}

export default App;
