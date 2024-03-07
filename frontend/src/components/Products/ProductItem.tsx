import React from "react";
import type { Product } from "../../store/products-slice";

type ProductItemProps = { product: Product };

const ProductItem: React.FC<ProductItemProps> = (props) => {

  return (
    <li>
      <article>
        <img src={props.product.image} alt={props.product.title} />
        <div>
          <h4>{props.product.title}</h4>
          <p>{props.product.description}</p>
          <p>{props.product.price}€</p>
        </div>
        <div>
          <p>{props.product.quantity} pz</p>
        </div>
      </article>
    </li>
  );
};

export { ProductItem };
