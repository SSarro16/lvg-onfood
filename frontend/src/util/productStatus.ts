export type ProductStatus = "available" | "wip" | "unavailable";

type ProductStatusSource = {
  quantity?: number | null;
  estimatedCompletedTime?: number | null;
};

export type ProductStatusMeta = {
  status: ProductStatus;
  label: string;
  detailLabel: string;
  icon: "check" | "clock" | "x";
  primeIcon: string;
  badge: "success" | "warn" | "danger";
  cta: string;
  title: string;
  message: string;
};

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
      return "In lavorazione";
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

export function getProductStatusMeta(
  product: ProductStatusSource
): ProductStatusMeta {
  const status = getProductStatus(product);
  const estimatedCompletedTime = product.estimatedCompletedTime ?? 0;

  switch (status) {
    case "available":
      return {
        status,
        label: "Disponibile",
        detailLabel: "Disponibile ora",
        icon: "check",
        primeIcon: "pi pi-check",
        badge: "success",
        cta: "Vedi dettagli",
        title: "Prodotto pronto al banco",
        message:
          "Questo prodotto e disponibile e puo essere acquistato subito in gastronomia.",
      };
    case "wip":
      return {
        status,
        label: "In lavorazione",
        detailLabel: `Pronto tra ${estimatedCompletedTime} min`,
        icon: "clock",
        primeIcon: "pi pi-clock",
        badge: "warn",
        cta: "Segui preparazione",
        title: "Preparazione in corso",
        message:
          "Il prodotto e in cucina. Il tempo indicato aiuta il cliente a capire quando tornare a controllare.",
      };
    case "unavailable":
      return {
        status,
        label: "Terminato",
        detailLabel: "Terminato per oggi",
        icon: "x",
        primeIcon: "pi pi-times",
        badge: "danger",
        cta: "Avvisami",
        title: "Prodotto non disponibile",
        message:
          "Questo prodotto e terminato. Puo tornare disponibile con un nuovo aggiornamento del banco.",
      };
  }
}
