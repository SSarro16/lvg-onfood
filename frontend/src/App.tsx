// css import
import "./App.css";
// react import
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
// pages import
import LogInPage from "./pages/LogIn";
import HomePage from "./pages/Home";
import RootLayout from "./pages/RootLayout";
import NewProductPage from "./pages/NewProduct";
import LoadingPage from "./pages/Loading";
// store imports
import type { Product } from "./store/redux/products-slice";
import { productsActions } from "./store/redux/products-slice";
// others import
import { PrimeReactProvider } from "primereact/api";
import { tokenLoader } from "./util/auth";
import { fetchProducts } from "./util/http";
import { Toast } from "primereact/toast";

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
  const toast = useRef<Toast>(null);
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();

  const setProductsHandler = (products: Product[]) => {
    dispatch(productsActions.setProducts({ products: products }));
  };

  const fetchingProducts = async () => {
    // fetching
    setIsFetching(true);

    const errorHandler = () => {
      // TOAST
       toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Fetching products failed",
        life: 3000,
      });
    };
    const successHandler = () => {
      // TOAST
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Fetching products successfully",
        life: 3000,
      });
    };
    // fetch products
    const fetchedProducts = await fetchProducts({
      errorHandler,
      successHandler,
    });

    if (fetchedProducts) {
      // redux
      setProductsHandler(fetchedProducts);
    }

    // end fetching
    setIsFetching(false);
  };

  useEffect(() => {
    fetchingProducts();
  }, []);

  return (
    <PrimeReactProvider>
      <Toast ref={toast} />
      {isFetching ? (
        <LoadingPage text={"Fetching products"} />
      ) : (
        <RouterProvider router={router} />
      )}
    </PrimeReactProvider>
  );
}

export default App;
