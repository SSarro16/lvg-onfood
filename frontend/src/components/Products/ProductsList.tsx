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

  return (
    <ol style={{ listStyleType: "none" }}>
      <div className="product-list">
        {props.products.map((product) => (
          <ProductItem key={product.id} product={product} token={token} />
        ))}
      </div>
    </ol>
  );
};

export default ProductsList;
