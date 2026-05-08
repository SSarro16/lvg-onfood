import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../store/context/auth-context";
import { RootState } from "../store/redux";
import type { Product } from "../store/redux/products-slice";
import ProductCard, {
  formatProductPrice,
  statusTone,
} from "../components/Products/ProductCard";
import LvgBadge from "../components/UI/LvgBadge";
import { useProducts } from "../store/context/products-context";
import { useToast } from "../store/context/toaster-context";
import { fetchUpdateProduct } from "../util/http";
import {
  getProductStatus,
  getProductStatusLabel,
  ProductStatus,
} from "../util/productStatus";
import lvglogo from "../assets/lvglogo.png";

type MenuMode = "client" | "admin";

const fallbackCategory = "Gastronomia";

const productPayload = (product: Product) => ({
  title: product.title,
  image: product.image,
  price: product.price,
  description: product.description || "",
  quantity: product.quantity ?? 0,
  estimatedCompletedTime: product.estimatedCompletedTime ?? 0,
});

const hasProductChanged = (nextProduct: Product, prevProduct?: Product) => {
  if (!prevProduct) return true;
  return (
    nextProduct.quantity !== prevProduct.quantity ||
    nextProduct.estimatedCompletedTime !== prevProduct.estimatedCompletedTime ||
    nextProduct.title !== prevProduct.title ||
    nextProduct.image !== prevProduct.image ||
    nextProduct.price !== prevProduct.price ||
    (nextProduct.description || "") !== (prevProduct.description || "")
  );
};

const getDraftPatch = (
  status: ProductStatus,
  quickQty: number,
  quickEta: number
): Pick<Product, "quantity" | "estimatedCompletedTime"> => {
  if (status === "available") {
    return { quantity: quickQty, estimatedCompletedTime: 0 };
  }
  if (status === "wip") {
    return { quantity: 0, estimatedCompletedTime: quickEta };
  }
  return { quantity: 0, estimatedCompletedTime: 0 };
};

function getProductStateValue(product: Product) {
  const status = getProductStatus(product);
  if (status === "available") return `${product.quantity ?? 0} pz`;
  if (status === "wip") return `${product.estimatedCompletedTime ?? 0} min`;
  return "Terminato";
}

export default function LiveMenuPage() {
  const products = useSelector((state: RootState) => state.products.products);
  const { currentUser, getToken } = useContext(AuthContext);
  const { refetchProducts } = useProducts();
  const { showToast } = useToast();
  const [mode, setMode] = useState<MenuMode>("client");
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [inventorySearchTerm, setInventorySearchTerm] = useState("");
  const [confirmedProducts, setConfirmedProducts] = useState<Product[]>(products);
  const [draftProducts, setDraftProducts] = useState<Product[]>(products);
  const [hasDraftChanges, setHasDraftChanges] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [quickQty, setQuickQty] = useState(10);
  const [quickEta, setQuickEta] = useState(25);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setConfirmedProducts(products);
    setDraftProducts(products);
    setHasDraftChanges(false);
    setSelectedIds([]);
  }, [products]);

  const availableProducts = useMemo(() => {
    const normalizedSearch = clientSearchTerm.trim().toLowerCase();
    return confirmedProducts.filter((product) => {
      const matchesStatus = getProductStatus(product) === "available";
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.title.toLowerCase().includes(normalizedSearch) ||
        (product.description || "").toLowerCase().includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [confirmedProducts, clientSearchTerm]);

  const visibleInventoryProducts = useMemo(() => {
    const normalizedSearch = inventorySearchTerm.trim().toLowerCase();
    return draftProducts.filter((product) => {
      if (normalizedSearch.length === 0) return true;
      return (
        product.title.toLowerCase().includes(normalizedSearch) ||
        (product.description || "").toLowerCase().includes(normalizedSearch)
      );
    });
  }, [draftProducts, inventorySearchTerm]);

  const selectedProducts = useMemo(
    () => draftProducts.filter((product) => selectedIds.includes(product.id)),
    [draftProducts, selectedIds]
  );

  const draftCounts = useMemo(
    () =>
      draftProducts.reduce(
        (counts, product) => {
          counts[getProductStatus(product)] += 1;
          return counts;
        },
        { available: 0, wip: 0, unavailable: 0 } as Record<ProductStatus, number>
      ),
    [draftProducts]
  );

  const availableQuantity = availableProducts.reduce(
    (total, product) => total + (product.quantity ?? 0),
    0
  );
  const averagePrice =
    availableProducts.length > 0
      ? availableProducts.reduce((total, product) => total + (product.price ?? 0), 0) /
        availableProducts.length
      : 0;

  const markDraftChanged = (nextProducts: Product[]) => {
    const confirmedById = new Map(
      confirmedProducts.map((product) => [product.id, product])
    );
    setHasDraftChanges(
      nextProducts.some((product) =>
        hasProductChanged(product, confirmedById.get(product.id))
      )
    );
  };

  const updateDraftProducts = (updater: (products: Product[]) => Product[]) => {
    setDraftProducts((prevProducts) => {
      const nextProducts = updater(prevProducts);
      markDraftChanged(nextProducts);
      return nextProducts;
    });
  };

  const applyStatus = (ids: string[], status: ProductStatus) => {
    if (ids.length === 0) return;
    updateDraftProducts((prevProducts) =>
      prevProducts.map((product) =>
        ids.includes(product.id)
          ? { ...product, ...getDraftPatch(status, quickQty, quickEta) }
          : product
      )
    );
  };

  const toggleSelected = (productId: string) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(productId)
        ? prevIds.filter((id) => id !== productId)
        : [...prevIds, productId]
    );
  };

  const resetDraftMenu = () => {
    setDraftProducts(confirmedProducts);
    setHasDraftChanges(false);
    setSelectedIds([]);
  };

  const confirmDraftMenu = async () => {
    if (!hasDraftChanges || isSaving) return;
    const token = await getToken();
    if (!token) {
      showToast({
        severity: "warn",
        summary: "Accesso richiesto",
        detail: "Effettua il login per confermare il menu.",
        life: 3000,
      });
      return;
    }

    const confirmedById = new Map(
      confirmedProducts.map((product) => [product.id, product])
    );
    const changedProducts = draftProducts.filter((product) =>
      hasProductChanged(product, confirmedById.get(product.id))
    );

    setIsSaving(true);
    let failedMessage = "";
    for (const product of changedProducts) {
      await fetchUpdateProduct(token, product.id, productPayload(product), {
        errorSavingHandler: (message) => {
          failedMessage = message;
        },
      });
      if (failedMessage) break;
    }

    if (failedMessage) {
      setIsSaving(false);
      showToast({
        severity: "error",
        summary: "Menu non confermato",
        detail: failedMessage,
        life: 3500,
      });
      return;
    }

    setConfirmedProducts(draftProducts);
    setHasDraftChanges(false);
    setSelectedIds([]);
    await refetchProducts();
    setIsSaving(false);
    showToast({
      severity: "success",
      summary: "Menu confermato",
      detail: "Il menu live e stato aggiornato.",
      life: 2500,
    });
  };

  return (
    <section className="lvg-menu-live">
      <div className="lvg-page-hero">
        <LvgBadge tone="dark" icon="chef">
          Banco live
        </LvgBadge>
        <h1>Menu live</h1>
        <p>
          Qui mostriamo solo i prodotti realmente disponibili al banco.
          Preparazioni in corso e prodotti terminati restano fuori dal menu
          pubblico per non confondere il cliente.
        </p>
      </div>

      <div className="lvg-mode-tabs" role="tablist" aria-label="Modalita menu live">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "client"}
          onClick={() => setMode("client")}
        >
          Cliente
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "admin"}
          onClick={() => setMode("admin")}
        >
          Admin
        </button>
      </div>

      {mode === "client" ? (
        <ClientMenu
          products={availableProducts}
          searchTerm={clientSearchTerm}
          setSearchTerm={setClientSearchTerm}
          totalQuantity={availableQuantity}
          averagePrice={averagePrice}
        />
      ) : (
        <AdminMenu
          visibleInventoryProducts={visibleInventoryProducts}
          selectedIds={selectedIds}
          selectedProducts={selectedProducts}
          inventorySearchTerm={inventorySearchTerm}
          setInventorySearchTerm={setInventorySearchTerm}
          quickQty={quickQty}
          quickEta={quickEta}
          setQuickQty={setQuickQty}
          setQuickEta={setQuickEta}
          draftCounts={draftCounts}
          onToggleSelected={toggleSelected}
          onSelectVisible={() =>
            setSelectedIds(visibleInventoryProducts.map((product) => product.id))
          }
          onClearSelected={() => setSelectedIds([])}
          onApplyStatus={applyStatus}
          onConfirm={confirmDraftMenu}
          onReset={resetDraftMenu}
          hasDraftChanges={hasDraftChanges}
          isSaving={isSaving}
          isAuthenticated={Boolean(currentUser)}
        />
      )}
    </section>
  );
}

function ClientMenu({
  products,
  searchTerm,
  setSearchTerm,
  totalQuantity,
  averagePrice,
}: {
  products: Product[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  totalQuantity: number;
  averagePrice: number;
}) {
  return (
    <>
      <div className="lvg-live-toolbar">
        <label className="lvg-search" htmlFor="menu-live-search">
          <i className="pi pi-search" aria-hidden="true" />
          <input
            id="menu-live-search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Cerca tra i prodotti disponibili..."
          />
        </label>
        <div className="lvg-live-stats" aria-label="Statistiche menu live">
          <Stat label="Solo disponibili" value={products.length.toString()} />
          <Stat label="Prodotti" value={products.length.toString()} />
          <Stat label="Pz totali" value={`${totalQuantity}`} />
          <Stat label="Media" value={formatProductPrice(averagePrice)} />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="lvg-empty">
          <i className="pi pi-shopping-bag" aria-hidden="true" />
          <strong>Nessun prodotto disponibile</strong>
          <p>Il banco live mostrera solo i prodotti acquistabili ora.</p>
        </div>
      ) : (
        <ol className="lvg-products-grid">
          {products.map((product, index) => (
            <li
              key={product.id}
              style={{ "--lvg-card-delay": `${index * 55}ms` } as React.CSSProperties}
            >
              <ProductCard product={product} />
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

function AdminMenu({
  visibleInventoryProducts,
  selectedIds,
  selectedProducts,
  inventorySearchTerm,
  setInventorySearchTerm,
  quickQty,
  quickEta,
  setQuickQty,
  setQuickEta,
  draftCounts,
  onToggleSelected,
  onSelectVisible,
  onClearSelected,
  onApplyStatus,
  onConfirm,
  onReset,
  hasDraftChanges,
  isSaving,
  isAuthenticated,
}: {
  visibleInventoryProducts: Product[];
  selectedIds: string[];
  selectedProducts: Product[];
  inventorySearchTerm: string;
  setInventorySearchTerm: (value: string) => void;
  quickQty: number;
  quickEta: number;
  setQuickQty: (value: number) => void;
  setQuickEta: (value: number) => void;
  draftCounts: Record<ProductStatus, number>;
  onToggleSelected: (productId: string) => void;
  onSelectVisible: () => void;
  onClearSelected: () => void;
  onApplyStatus: (ids: string[], status: ProductStatus) => void;
  onConfirm: () => void;
  onReset: () => void;
  hasDraftChanges: boolean;
  isSaving: boolean;
  isAuthenticated: boolean;
}) {
  return (
    <div className="lvg-admin-menu">
      <section className="lvg-admin-hero" aria-labelledby="admin-menu-title">
        <div className="lvg-admin-hero__copy">
          <span className="lvg-admin-hero__badge">Inventory admin</span>
          <h2 id="admin-menu-title">Prepara il menu del giorno</h2>
          <p>
            Puoi selezionare piu card dall&apos;inventory completo. Nulla viene
            pubblicato finche non premi il bottone verde di conferma.
          </p>
        </div>
        <div className="lvg-admin-hero__stats" aria-label="Statistiche bozza">
          <AdminStat label="Disp." value={draftCounts.available} />
          <AdminStat label="Lav." value={draftCounts.wip} />
          <AdminStat label="Term." value={draftCounts.unavailable} />
        </div>

        <div className="lvg-admin-quick">
          <label>
            <span>Pezzi se disponibile</span>
            <strong>
              <input
                type="number"
                min="1"
                value={quickQty}
                onChange={(event) =>
                  setQuickQty(Math.max(1, Number(event.target.value) || 1))
                }
              />
              pz
            </strong>
          </label>
          <label>
            <span>Tempo se in lavorazione</span>
            <strong>
              <input
                type="number"
                min="1"
                value={quickEta}
                onChange={(event) =>
                  setQuickEta(Math.max(1, Number(event.target.value) || 1))
                }
              />
              min
            </strong>
          </label>
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => onApplyStatus(selectedIds, "available")}
          >
            Metti nel menu
          </button>
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => onApplyStatus(selectedIds, "wip")}
          >
            In cucina
          </button>
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => onApplyStatus(selectedIds, "unavailable")}
          >
            Terminati
          </button>
        </div>

        {!isAuthenticated && (
          <p className="lvg-admin-note">
            Puoi preparare la bozza, ma per confermare il menu serve il login admin.
          </p>
        )}
      </section>

      <div className="lvg-confirm-menu">
        <p>
          <strong>{selectedProducts.length} prodotti selezionati</strong>
          {selectedProducts.length > 0 && (
            <span> - {selectedProducts.map((product) => product.title).join(", ")}</span>
          )}
        </p>
        <div>
          <button
            type="button"
            className="lvg-cta lvg-cta--secondary"
            onClick={onReset}
            disabled={!hasDraftChanges || isSaving}
          >
            Annulla modifiche
          </button>
          <button
            type="button"
            className="lvg-cta lvg-cta--primary"
            onClick={onConfirm}
            disabled={!hasDraftChanges || isSaving}
          >
            {isSaving ? "Confermo..." : "Conferma menu"}
          </button>
        </div>
      </div>

      <section className="lvg-inventory-shell" aria-labelledby="inventory-title">
        <div className="lvg-inventory-shell__header">
          <div>
            <span>Inventory completo</span>
            <h2 id="inventory-title">Tutti i prodotti</h2>
          </div>
          <div className="lvg-inventory-tools">
            <label className="lvg-search" htmlFor="menu-admin-search">
              <i className="pi pi-search" aria-hidden="true" />
              <input
                id="menu-admin-search"
                value={inventorySearchTerm}
                onChange={(event) => setInventorySearchTerm(event.target.value)}
                placeholder="Cerca nell'inventory..."
              />
            </label>
            <button type="button" onClick={onSelectVisible}>
              Seleziona visibili
            </button>
            <button type="button" onClick={onClearSelected} disabled={selectedIds.length === 0}>
              Pulisci selezione
            </button>
          </div>
        </div>

        <ol className="lvg-inventory-grid">
          {visibleInventoryProducts.map((product) => (
            <li key={product.id}>
              <InventoryCard
                product={product}
                selected={selectedIds.includes(product.id)}
                onToggleSelected={onToggleSelected}
                onApplyStatus={(status) => onApplyStatus([product.id], status)}
              />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function AdminStat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InventoryCard({
  product,
  selected,
  onToggleSelected,
  onApplyStatus,
}: {
  product: Product;
  selected: boolean;
  onToggleSelected: (productId: string) => void;
  onApplyStatus: (status: ProductStatus) => void;
}) {
  const status = getProductStatus(product);
  const statusLabel = getProductStatusLabel(status);

  return (
    <article className="lvg-inventory-card" data-selected={selected}>
      <button
        className="lvg-inventory-card__media"
        type="button"
        onClick={() => onToggleSelected(product.id)}
        aria-pressed={selected}
      >
        <img
          src={product.image || lvglogo}
          alt={`Foto di ${product.title}`}
          onError={(event) => {
            event.currentTarget.src = lvglogo;
          }}
        />
        <span className="lvg-inventory-card__shade" aria-hidden="true" />
        <span className="lvg-inventory-card__select-icon" aria-hidden="true">
          <i className={selected ? "pi pi-check" : "pi pi-plus"} />
        </span>
        <LvgBadge
          tone={statusTone(status)}
          icon={status === "available" ? "check" : status === "wip" ? "clock" : "x"}
        >
          {statusLabel}
        </LvgBadge>
        <span className="lvg-inventory-card__title">{product.title}</span>
      </button>
      <div className="lvg-inventory-card__body">
        <span className="lvg-inventory-card__category">{fallbackCategory}</span>
        <p>{product.description || "Nessuna descrizione."}</p>
        <div className="lvg-inventory-card__meta">
          <strong>{formatProductPrice(product.price)}</strong>
          <span>{getProductStateValue(product)}</span>
        </div>
        <div className="lvg-inventory-actions" role="group" aria-label={`Azioni rapide ${product.title}`}>
          <button type="button" onClick={() => onApplyStatus("available")}>
            Disponibile
          </button>
          <button type="button" onClick={() => onApplyStatus("wip")}>
            Lavora
          </button>
          <button type="button" onClick={() => onApplyStatus("unavailable")}>
            Termina
          </button>
        </div>
        <button className="lvg-card-cta" type="button">
          Apri dettagli
        </button>
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="lvg-live-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
