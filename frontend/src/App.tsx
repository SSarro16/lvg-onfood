import React, { useContext, useEffect, useState } from "react";
import { RouterProvider, createBrowserRouter, json } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/Home";
import LogInPage, { action as authAction } from "./pages/LogIn";
import RootLayout from "./pages/RootLayout";
import { checkAuthLoader, tokenLoader } from "./util/auth";
import NewProductPage, { action as newproductAction } from "./pages/NewProduct";
import { action as logoutAction } from "./pages/LogOut";
import { useDispatch } from "react-redux";
import { productsActions } from "./store/products-slice";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import type { Product } from "./store/products-slice";

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
      {
        path: "newproduct",
        element: <NewProductPage />,
        action: newproductAction,
      },
    ],
  },
]);

function App() {
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();

  const setProductsHandler = (products: Product[]) => {
    dispatch(productsActions.setProducts({ products: products }));
  };

  const fetchProducts = async () => {
    // fetch products in backend
    // dispatch into redux store
    setIsFetching(true);
    const response = await fetch("http://localhost:8080/products/new", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const resData = await response.json();

    if (!response.ok) {
      throw json({ message: "Could not fetch" }, { status: 500 });
    }

    const fetchedProducts = resData.products as Product[];
    console.log(fetchedProducts);
    setProductsHandler(fetchedProducts);

    setIsFetching(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <PrimeReactProvider>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  );
}

export default App;
