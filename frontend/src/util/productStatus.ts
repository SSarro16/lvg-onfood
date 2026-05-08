import type { Product } from "../store/redux/products-slice";

export type ProductStatus = "available" | "wip" | "unavailable";

type ProductStatusSource = Pick<
  Product,
  "quantity" | "estimatedCompletedTime"
>;

export function getProductStatus(product: ProductStatusSource): ProductStatus {
  const quantity = product.quantity ?? 0;
  const estimatedCompletedTime = product.estimatedCompletedTime ?? 0;

  if (quantity > 0) return "available";
  if (estimatedCompletedTime > 0) return "wip";
  return "unavailable";
}

export function getProductStatusLabel(status: ProductStatus) {
  switch (status) {
    case "available":
      return "Disponibile";
    case "wip":
      return "In preparazione";
    case "unavailable":
      return "Terminato";
  }
}

export function getProductStatusIcon(status: ProductStatus) {
  switch (status) {
    case "available":
      return "pi pi-check";
    case "wip":
      return "pi pi-clock";
    case "unavailable":
      return "pi pi-times";
  }
}
