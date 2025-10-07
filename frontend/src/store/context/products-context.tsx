import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "./toaster-context";
import { fetchProducts } from "../../util/http";
import { productsActions } from "../redux/products-slice";
import LoadingPage from "../../pages/Loading";

type ProductsContextType = {
  refetchProducts: () => Promise<void>;
  isLoading: boolean;
};

const ProductsContext = createContext<ProductsContextType | null>(null);

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context)
    throw new Error("useProducts must be used within a ProductsProvider");
  return context;
};

export const ProductsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const refetchProducts = async () => {
    setIsLoading(true);
    const errorHandler = (error: string) => {
      showToast({
        severity: "error",
        summary: "Errore",
        detail: `Errore nel fetching: ${error}`,
        life: 3000,
      });
    };
    const successHandler = () => {
      showToast({
        severity: "success",
        summary: "Successo",
        detail: "Prodotti Aggiornati",
        life: 2000,
      });
    };
    const products = await fetchProducts({ errorHandler, successHandler });
    if (products) {
      dispatch(productsActions.setProducts({ products }));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refetchProducts();
  }, []);

  if (isLoading) {
    return <LoadingPage text="Caricamento prodotti..." />;
  }

  return (
    <ProductsContext.Provider value={{ refetchProducts, isLoading }}>
      {children}
    </ProductsContext.Provider>
  );
};
