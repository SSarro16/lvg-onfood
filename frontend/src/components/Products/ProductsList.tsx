import React, { useContext, useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import type { Product } from "../../store/redux/products-slice";
import { AuthContext } from "../../store/context/auth-context";

type ProductsListProps = {
  products: Product[];
  onResetFilters?: () => void;
};

const ProductsList: React.FC<ProductsListProps> = (props) => {
  const [token, setToken] = useState<string | undefined>();
  const { currentUser, getToken } = useContext(AuthContext);

  const refreshToken = async () => {
    const newToken = await getToken();
    setToken(newToken);
  };

  useEffect(() => {
    refreshToken()
  }, [currentUser, getToken]);

  if (props.products.length === 0) {
    return (
      <div className="lvg-empty">
        <i className="pi pi-search" aria-hidden="true" />
        <strong>Nessun prodotto trovato</strong>
        <p>Prova a cambiare ricerca o filtro.</p>
        {props.onResetFilters && (
          <button className="lvg-cta lvg-cta--secondary" type="button" onClick={props.onResetFilters}>
            Mostra tutto
          </button>
        )}
      </div>
    );
  }

  return (
    <ol className="lvg-products-grid">
      {props.products.map((product, index) => (
        <li key={product.id} style={{ "--lvg-card-delay": `${index * 55}ms` } as React.CSSProperties}>
          <ProductItem key={product.id} product={product} token={token} />
        </li>
      ))}
    </ol>
  );
};

export default ProductsList;
