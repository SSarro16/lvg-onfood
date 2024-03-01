import React from "react";
import { getAuthToken } from "../../util/auth";

const ProductItem: React.FC<{meal: any}> = (props) => {
  const token = getAuthToken()

  return (
    <li>
      <article>
        <img src={props.meal.img} alt={props.meal.title} />
        <div>
          <h4>{props.meal.title}</h4>
          <p>{props.meal.description}</p>
          <p>{props.meal.price}€</p>
        </div>
        <div>
          {token && (<p>
            <button>+</button>
          </p>)}
          <p>{props.meal.quantity} pz</p>
           {token && (<p>
            <button>-</button>
          </p>)}
        </div>
      </article>
    </li>
  );
}

export {ProductItem};