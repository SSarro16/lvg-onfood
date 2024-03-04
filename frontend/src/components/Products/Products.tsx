import React, { useState } from "react";
import {ProductItem} from "./ProductItem";
import { useSelector } from "react-redux";
import type { Product } from "../../store/products-slice";
import type { RootState, AppDispatch } from "../../store";



export default function Products() {
  //
  const products = useSelector((state: RootState) => state.products.products)
  return (
    <ol style={{ listStyleType: "none" }}>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </ol>
  );
}
