import React, { useContext, useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import type { Product } from "../../store/redux/products-slice";
import { AuthContext } from "../../store/context/auth-context";

type ProductsListProps = {
  products: Product[];
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
        <strong>Nessun prodotto trovato.</strong>
        <p>Prova a cambiare filtro o ricerca per vedere altri prodotti del banco.</p>
      </div>
    );
  }

  return (
    <ol className="lvg-products-grid">
      {props.products.map((product) => (
        <li key={product.id}>
          <ProductItem key={product.id} product={product} token={token} />
        </li>
      ))}
    </ol>
  );
};

export default ProductsList;
