import React from "react";
import {ProductItem} from "./ProductItem";

const DUMMY_PRODUCTS = [
  {
    id: "1",
    title: "Gateaux di Patate",
    description: "Gateaux di Patate con Mozzarella e Prosciutto",
    image: "image1",
    price: "6",
    quantity: '6'
  },
  {
    id: "2",
    title: "Lenticchie",
    description: "Lenticchie",
    image: "image2",
    price: "4",
    quantity: '4'
  },
];

export default function Product() {
  return (
    <ol style={{ listStyleType: "none" }}>
      {DUMMY_PRODUCTS.map((meal) => (
        <ProductItem key={meal.id} meal={meal} />
      ))}
    </ol>
  );
}
