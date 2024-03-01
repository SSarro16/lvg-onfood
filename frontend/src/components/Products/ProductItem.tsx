import React from "react";

export default function ProductItem() {
  return (
      <li className="meal-item">
        <article>
          <img />
          <div>
            <h4>Title</h4>
            <p className="meal-item-description">Description</p>
            <p className="meal-item-price">Price</p>
          </div>
          <div className="meal-item-actions">
            <p>
              <button>+</button>
            </p>
            <p>quantity</p>
            <p>
              <button>-</button>
            </p>
          </div>
        </article>
      </li>
  );
}
