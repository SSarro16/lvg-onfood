import React from "react";
import type { Product } from "../../store/redux/products-slice";
import {
  getProductStatus,
  getProductStatusMeta,
  ProductStatus,
} from "../../util/productStatus";
import LvgBadge from "../UI/LvgBadge";
import lvglogo from "../../assets/lvglogo.png";

type ProductCardProps = {
  product: Pick<
    Product,
    "title" | "image" | "price" | "description" | "quantity" | "estimatedCompletedTime"
  >;
  className?: string;
};

const fallbackCategory = "Gastronomia";

export const formatProductPrice = (price: number) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(price ?? 0);

export function statusTone(status: ProductStatus): "success" | "warn" | "danger" {
  if (status === "available") return "success";
  if (status === "wip") return "warn";
  return "danger";
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const status = getProductStatus(product);
  const statusMeta = getProductStatusMeta(product);
  const title = product.title || "Nuovo prodotto";
  const description =
    product.description || "Descrizione del prodotto visibile nel banco live.";
  const quantity = product.quantity ?? 0;
  const eta = product.estimatedCompletedTime ?? 0;

  return (
    <article className={`lvg-product-card lvg-product-card--${status} ${className}`}>
      <div className="lvg-product-card__media">
        <img
          src={product.image || lvglogo}
          alt={`Foto di ${title}`}
          onError={(event) => {
            event.currentTarget.src = lvglogo;
          }}
        />
        <div className="lvg-product-card__shade" aria-hidden="true" />
        <LvgBadge tone={statusTone(status)} icon={statusMeta.icon}>
          {statusMeta.label}
        </LvgBadge>
        <div className="lvg-product-card__overlay">
          <span className="lvg-product-card__category">{fallbackCategory}</span>
          <div className="lvg-product-card__title-row">
            <h3>{title}</h3>
            <span className="lvg-price">{formatProductPrice(product.price)}</span>
          </div>
        </div>
      </div>
      <div className="lvg-product-card__body">
        <p>{description}</p>
        <div className="lvg-product-card__quantity">
          <span>
            <small>{status === "wip" ? "Attesa" : "Quantita"}</small>
            <strong>{status === "wip" ? `${eta} min` : `${quantity} pz`}</strong>
          </span>
          {status === "available" && <em>Disponibile</em>}
          {status === "unavailable" && <em>Terminato</em>}
        </div>
        <button className="lvg-card-cta" type="button">
          Vedi dettagli
        </button>
      </div>
    </article>
  );
}
