import React from "react";
import { getAuthToken } from "../../util/auth";
import type { Product } from "../../store/products-slice";

type ProductItemProps = { product: Product };

const ProductItem: React.FC<ProductItemProps> = (props) => {
  const token = getAuthToken();

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
          {token && (
            <p>
              <button>+</button>
            </p>
          )}
          <p>{props.product.quantity} pz</p>
          {token && (
            <p>
              <button>-</button>
            </p>
          )}
        </div>
      </article>
    </li>
  );
};

export { ProductItem };
