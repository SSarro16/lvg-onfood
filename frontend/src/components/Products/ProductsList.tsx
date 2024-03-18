import React, { useState } from "react";
import ProductItem from "./ProductItem";
import type { Product } from "../../store/redux/products-slice";

type ProductsListProps = {
  products: Product[];
};

const ProductsList: React.FC<ProductsListProps> = (props) => {
  return (
    <ol style={{ listStyleType: "none" }} className="inline-block flex-column">
      {props.products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </ol>
  );
};

export default ProductsList;

