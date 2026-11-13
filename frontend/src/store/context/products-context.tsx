import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useToast } from "./toaster-context";
import { fetchProducts } from "../../util/http";
import { productsActions } from "../redux/products-slice";
import LvgLoadingOverlay from "../../components/UI/LvgLoadingOverlay";
import LvgErrorOverlay from "../../components/UI/LvgErrorOverlay";

type ProductsContextType = {
  refetchProducts: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  const refetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    const errorHandler = (error: string) => {
      setError(error);
      showToast({
        severity: "error",
        summary: "Errore",
        detail: "Non siamo riusciti ad aggiornare il banco.",
        life: 3000,
      });
    };
    const products = await fetchProducts({ errorHandler });
    if (products) {
      dispatch(productsActions.setProducts({ products }));
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refetchProducts();
  }, []);

  if (isLoading) {
    return (
      <LvgLoadingOverlay
        title="Carico i prodotti del giorno..."
        message="Stiamo preparando il banco digitale LVG."
      />
    );
  }

  if (error) {
    return (
      <LvgErrorOverlay
        title="Non siamo riusciti ad aggiornare il banco."
        message="Controlla la connessione e riprova tra qualche secondo."
        details={error}
        onRetry={refetchProducts}
      />
    );
  }

  return (
    <ProductsContext.Provider value={{ refetchProducts, isLoading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};
