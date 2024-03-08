import React from "react";
import type { Product } from "../../store/products-slice";
import ProductDetail from "./ProductDetail";

type ProductItemProps = { product: Product };

const ProductItem: React.FC<ProductItemProps> = (props) => {
  const DetailPageHandler = () => {
    <ProductDetail product={props.product} />
  }

  return (
    <li>
      <article>
        <button type="button" onClick={DetailPageHandler}>
          <img
            height={100}
            width={100}
            src={props.product.image}
            alt={props.product.title}
          />
        </button>

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
