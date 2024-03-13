// css import
import "./App.css";
// react import
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
// pages import
import LogInPage, { action as authAction } from "./pages/LogIn";
import HomePage from "./pages/Home";
import RootLayout from "./pages/RootLayout";
import NewProductPage, { action as newProductAction } from "./pages/NewProduct";
import LoadingPage from "./pages/Loading";
// store imports
import type { Product } from "./store/redux/products-slice";
import { productsActions } from "./store/redux/products-slice";
// others import
import { PrimeReactProvider } from "primereact/api";
import { tokenLoader } from "./util/auth";
import { fetchProducts } from "./util/http";

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
        action: newProductAction,
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

  const fetchingProducts = async () => {
    // fetching
    setIsFetching(true);

    const errorHandler = (error: string) => {
      // TOAST
      console.log(error);
    };
    const successHandler = () => {
      // TOAST
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
      {isFetching ? (
        <LoadingPage text={"Fetching products"} />
      ) : (
        <RouterProvider router={router} />
      )}
    </PrimeReactProvider>
  );
}

export default App;
