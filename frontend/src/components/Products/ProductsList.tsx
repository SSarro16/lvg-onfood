import React, { useState } from "react";
import { ProductItem } from "./ProductItem";
import { useSelector } from "react-redux";
import type { Product } from "../../store/redux/products-slice";
import type { RootState, AppDispatch } from "../../store/redux";

type ProductsListProps = {
  products: Product[];
};

const ProductsList: React.FC<ProductsListProps> = (props) => {
  return (
    <ol style={{ listStyleType: "none" }}>
      {props.products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </ol>
  );
};

export default ProductsList;
