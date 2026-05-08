import React, { ChangeEvent, useMemo, useState } from "react";
import { Product } from "../../store/redux/products-slice";
import { fetchDeleteProduct, fetchUpdateProduct } from "../../util/http";
import { useToast } from "../../store/context/toaster-context";
import { useProducts } from "../../store/context/products-context";
import { getProductStatusMeta } from "../../util/productStatus";
import lvglogo from "../../assets/lvglogo.png";
import LvgBadge from "../UI/LvgBadge";
import LvgErrorOverlay from "../UI/LvgErrorOverlay";
import LvgIcon from "../UI/LvgIcon";
import LvgLoadingOverlay from "../UI/LvgLoadingOverlay";
import LvgModalShell from "../UI/LvgModalShell";
import LvgQuantityStepper from "../UI/LvgQuantityStepper";

type ProductItemProps = { product: Product; token?: string };

type ProductFormFields = {
  title: string;
  image: string;
  price: number;
  description: string;
  quantity: number;
  estimatedCompletedTime: number;
};

type ActiveOverlay = "detail" | "edit" | "ready" | "unavailable" | "delete" | null;

const fallbackCategory = "Gastronomia";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(price ?? 0);

const productToFormFields = (product: Product): ProductFormFields => ({
  title: product.title,
  image: product.image,
  price: product.price ?? 0,
  description: product.description || "",
  quantity: product.quantity ?? 0,
  estimatedCompletedTime: product.estimatedCompletedTime ?? 0,
});

const closeErrorCopy =
  "Non siamo riusciti a completare l'operazione. Riprova tra qualche secondo.";

const ProductItem: React.FC<ProductItemProps> = ({ product, token }) => {
  const { showToast } = useToast();
  const { refetchProducts } = useProducts();
  const [activeOverlay, setActiveOverlay] = useState<ActiveOverlay>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<(() => Promise<void>) | null>(null);
  const [formFields, setFormFields] = useState<ProductFormFields>(() =>
    productToFormFields(product)
  );
  const [readyQuantity, setReadyQuantity] = useState(
    Math.max(product.quantity ?? 0, 1)
  );

  const statusMeta = useMemo(() => getProductStatusMeta(product), [product]);
  const formStatusMeta = useMemo(
    () => getProductStatusMeta(formFields),
    [formFields]
  );
  const hasToken = Boolean(token);
  const description = product.description || "Descrizione non disponibile.";
  const quantity = product.quantity ?? 0;
  const eta = product.estimatedCompletedTime ?? 0;

  const openOverlay = (overlay: ActiveOverlay) => {
    setError(null);
    if (overlay === "edit") {
      setFormFields(productToFormFields(product));
    }
    if (overlay === "ready") {
      setReadyQuantity(Math.max(quantity, 1));
    }
    setActiveOverlay(overlay);
  };

  const closeOverlay = () => {
    if (!isBusy) setActiveOverlay(null);
  };

  const handleTextChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormFields((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleNumberChange = (
    name: keyof Pick<
      ProductFormFields,
      "price" | "quantity" | "estimatedCompletedTime"
    >,
    value: string
  ) => {
    setFormFields((prevState) => ({
      ...prevState,
      [name]: Number(value) || 0,
    }));
  };

  const runUpdate = async (
    bodyData: ProductFormFields,
    successMessage: string,
    nextOverlay: ActiveOverlay = null
  ) => {
    if (!token) return;
    const action = async () => runUpdate(bodyData, successMessage, nextOverlay);
    setLastAction(() => action);
    setIsBusy(true);
    setError(null);
    await fetchUpdateProduct(token, product.id, bodyData, {
      errorSavingHandler: (message) => {
        setError(message);
        setIsBusy(false);
      },
      successSavingHandler: async () => {
        await refetchProducts();
        setIsBusy(false);
        setActiveOverlay(nextOverlay);
        showToast({
          severity: "success",
          summary: "Banco aggiornato",
          detail: successMessage,
          life: 2500,
        });
      },
    });
  };

  const runDelete = async () => {
    if (!token) return;
    const action = async () => runDelete();
    setLastAction(() => action);
    setIsBusy(true);
    setError(null);
    await fetchDeleteProduct(token, product.id, {
      errorDeleteHandler: (message) => {
        setError(message);
        setIsBusy(false);
      },
      successDeleteHandler: async () => {
        await refetchProducts();
        setIsBusy(false);
        setActiveOverlay(null);
        showToast({
          severity: "success",
          summary: "Prodotto eliminato",
          detail: "Il banco e stato aggiornato.",
          life: 2500,
        });
      },
    });
  };

  const adminActions = hasToken ? (
    <div className="lvg-overlay-actions">
      <button className="lvg-action-button" type="button" onClick={() => openOverlay("edit")}>
        <LvgIcon name="edit" />
        Modifica
      </button>
      <button className="lvg-action-button" type="button" onClick={() => openOverlay("ready")}>
        <LvgIcon name="check" />
        Segna pronto
      </button>
      <button
        className="lvg-action-button lvg-action-button--warn"
        type="button"
        onClick={() => openOverlay("unavailable")}
      >
        <LvgIcon name="x" />
        Termina
      </button>
      <button
        className="lvg-action-button lvg-action-button--danger"
        type="button"
        onClick={() => openOverlay("delete")}
      >
        <LvgIcon name="trash" />
        Elimina
      </button>
    </div>
  ) : null;

  return (
    <>
      <article className={`lvg-product-card lvg-product-card--${statusMeta.status}`}>
        <div className="lvg-product-card__media">
          <img
            src={product.image || lvglogo}
            alt={`Foto di ${product.title || "prodotto gastronomia LVG"}`}
            onError={(event) => {
              event.currentTarget.src = lvglogo;
            }}
          />
          <div className="lvg-product-card__shade" aria-hidden="true" />
          <LvgBadge tone={statusMeta.badge} icon={statusMeta.icon}>
            {statusMeta.label}
          </LvgBadge>
          <div className="lvg-product-card__overlay">
            <span className="lvg-product-card__category">{fallbackCategory}</span>
            <div className="lvg-product-card__title-row">
              <h3>{product.title}</h3>
              <span className="lvg-price">{formatPrice(product.price)}</span>
            </div>
          </div>
        </div>
        <div className="lvg-product-card__body">
          <p>{description}</p>
          <div className="lvg-product-card__quantity">
            <span>
              <small>Quantita</small>
              <strong>{quantity} pz</strong>
            </span>
            {statusMeta.status === "wip" && eta > 0 && <em>{eta} min</em>}
          </div>
          <button className="lvg-card-cta" type="button" onClick={() => openOverlay("detail")}>
            {statusMeta.cta}
          </button>
        </div>
      </article>

      {activeOverlay === "detail" && (
        <LvgModalShell onClose={closeOverlay} labelledBy={`detail-title-${product.id}`}>
          <div className="lvg-detail-overlay">
            <div className="lvg-detail-visual">
              <img
                src={product.image || lvglogo}
                alt={`Foto di ${product.title}`}
                onError={(event) => {
                  event.currentTarget.src = lvglogo;
                }}
              />
              <div className="lvg-detail-visual__shade" aria-hidden="true" />
              <div className="lvg-detail-visual__content">
                <LvgBadge tone={statusMeta.badge} icon={statusMeta.icon}>
                  {statusMeta.detailLabel}
                </LvgBadge>
                <span>{fallbackCategory}</span>
                <h2 id={`detail-title-${product.id}`}>{product.title}</h2>
              </div>
            </div>
            <div className="lvg-detail-content">
              <span className="lvg-eyebrow">Dettaglio prodotto</span>
              <h3>{statusMeta.title}</h3>
              <p>{statusMeta.message}</p>
              <div className="lvg-price-box">
                <span>Prezzo al banco</span>
                <strong>{formatPrice(product.price)}</strong>
              </div>
              <p className="lvg-detail-description">{description}</p>
              <div className="lvg-info-grid">
                <InfoCard label="Quantita" value={`${quantity} pz`} />
                <InfoCard label="Attesa" value={eta > 0 ? `${eta} min` : "Ora"} />
                <InfoCard label="Reparto" value={fallbackCategory} />
              </div>
              <div className="lvg-status-panel">
                <LvgBadge tone={statusMeta.badge} icon={statusMeta.icon}>
                  Stato banco
                </LvgBadge>
                <strong>{statusMeta.detailLabel}</strong>
                <p>{statusMeta.message}</p>
              </div>
              {adminActions}
            </div>
          </div>
        </LvgModalShell>
      )}

      {activeOverlay === "edit" && (
        <LvgModalShell onClose={closeOverlay} labelledBy={`edit-title-${product.id}`}>
          <div className="lvg-edit-overlay">
            <div className="lvg-edit-form">
              <span className="lvg-eyebrow">Admin banco</span>
              <h2 id={`edit-title-${product.id}`}>Modifica prodotto</h2>
              <p>
                Aggiorna informazioni, disponibilita e tempi senza cambiare il
                significato del prodotto nel dataset.
              </p>
              <ProductField id={`title-${product.id}`} label="Titolo">
                <input
                  id={`title-${product.id}`}
                  name="title"
                  value={formFields.title}
                  onChange={handleTextChange}
                />
              </ProductField>
              <ProductField id={`price-${product.id}`} label="Prezzo (EUR)">
                <input
                  id={`price-${product.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={formFields.price}
                  onChange={(event) => handleNumberChange("price", event.target.value)}
                />
              </ProductField>
              <div className="lvg-form-row">
                <ProductField id={`quantity-${product.id}`} label="Quantita disponibile">
                  <input
                    id={`quantity-${product.id}`}
                    type="number"
                    min="0"
                    value={formFields.quantity}
                    onChange={(event) =>
                      handleNumberChange("quantity", event.target.value)
                    }
                  />
                </ProductField>
                <ProductField id={`eta-${product.id}`} label="Tempo stimato (minuti)">
                  <input
                    id={`eta-${product.id}`}
                    type="number"
                    min="0"
                    value={formFields.estimatedCompletedTime}
                    onChange={(event) =>
                      handleNumberChange("estimatedCompletedTime", event.target.value)
                    }
                  />
                </ProductField>
              </div>
              <ProductField id={`description-${product.id}`} label="Descrizione">
                <textarea
                  id={`description-${product.id}`}
                  name="description"
                  rows={4}
                  value={formFields.description}
                  onChange={handleTextChange}
                />
              </ProductField>
              <ProductField id={`image-${product.id}`} label="URL immagine">
                <input
                  id={`image-${product.id}`}
                  name="image"
                  type="url"
                  value={formFields.image}
                  onChange={handleTextChange}
                />
              </ProductField>
              <div className="lvg-modal-footer">
                <button className="lvg-cta lvg-cta--secondary" type="button" onClick={closeOverlay}>
                  Annulla
                </button>
                <button
                  className="lvg-cta lvg-cta--primary"
                  type="button"
                  onClick={() =>
                    runUpdate(formFields, "Il prodotto e stato salvato correttamente.")
                  }
                >
                  Salva modifiche
                </button>
              </div>
            </div>
            <div className="lvg-edit-preview">
              <img
                src={formFields.image || lvglogo}
                alt={`Anteprima di ${formFields.title || product.title}`}
                onError={(event) => {
                  event.currentTarget.src = lvglogo;
                }}
              />
              <button
                className="lvg-action-button"
                type="button"
                onClick={() => document.getElementById(`image-${product.id}`)?.focus()}
              >
                <LvgIcon name="upload" />
                Cambia immagine
              </button>
              <div className="lvg-status-panel">
                <span className="lvg-eyebrow">Stato attuale</span>
                <LvgBadge tone={formStatusMeta.badge} icon={formStatusMeta.icon}>
                  {formStatusMeta.detailLabel}
                </LvgBadge>
                <div className="lvg-info-grid lvg-info-grid--compact">
                  <InfoCard label="Quantita" value={`${formFields.quantity} pz`} />
                  <InfoCard
                    label="Tempo"
                    value={
                      formFields.estimatedCompletedTime > 0
                        ? `${formFields.estimatedCompletedTime} min`
                        : "Ora"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </LvgModalShell>
      )}

      {activeOverlay === "ready" && (
        <LvgModalShell size="medium" onClose={closeOverlay} labelledBy={`ready-title-${product.id}`}>
          <div className="lvg-confirm-overlay lvg-confirm-overlay--success">
            <LvgBadge tone="success" icon="check">Banco live</LvgBadge>
            <h2 id={`ready-title-${product.id}`}>Segna prodotto come pronto</h2>
            <p>
              Questo prodotto tornera disponibile nel banco. Inserisci la
              quantita ora pronta per i clienti.
            </p>
            <div className="lvg-ready-box">
              <span>Quantita disponibile</span>
              <LvgQuantityStepper value={readyQuantity} onChange={setReadyQuantity} min={0} />
            </div>
            <div className="lvg-modal-footer">
              <button className="lvg-cta lvg-cta--secondary" type="button" onClick={closeOverlay}>
                Annulla
              </button>
              <button
                className="lvg-cta lvg-cta--primary"
                type="button"
                onClick={() =>
                  runUpdate(
                    {
                      ...productToFormFields(product),
                      quantity: readyQuantity,
                      estimatedCompletedTime: 0,
                    },
                    "Il prodotto e tornato disponibile."
                  )
                }
              >
                Conferma disponibilita
              </button>
            </div>
          </div>
        </LvgModalShell>
      )}

      {activeOverlay === "unavailable" && (
        <LvgModalShell size="medium" onClose={closeOverlay} labelledBy={`unavailable-title-${product.id}`}>
          <div className="lvg-confirm-overlay lvg-confirm-overlay--warn">
            <LvgBadge tone="warn" icon="alert">Aggiornamento banco</LvgBadge>
            <h2 id={`unavailable-title-${product.id}`}>Segna come terminato</h2>
            <p>
              Il prodotto non sara piu visibile come disponibile. Potrai
              riattivarlo aggiornando quantita e tempi in seguito.
            </p>
            <ProductMiniCard product={product} />
            <div className="lvg-modal-footer">
              <button className="lvg-cta lvg-cta--secondary" type="button" onClick={closeOverlay}>
                Annulla
              </button>
              <button
                className="lvg-cta lvg-cta--warning"
                type="button"
                onClick={() =>
                  runUpdate(
                    {
                      ...productToFormFields(product),
                      quantity: 0,
                      estimatedCompletedTime: 0,
                    },
                    "Il prodotto e stato segnato come terminato."
                  )
                }
              >
                Segna terminato
              </button>
            </div>
          </div>
        </LvgModalShell>
      )}

      {activeOverlay === "delete" && (
        <LvgModalShell size="medium" onClose={closeOverlay} labelledBy={`delete-title-${product.id}`}>
          <div className="lvg-confirm-overlay lvg-confirm-overlay--danger">
            <span className="lvg-danger-mark">
              <LvgIcon name="trash" />
            </span>
            <h2 id={`delete-title-${product.id}`}>Eliminare questo prodotto?</h2>
            <ProductMiniCard product={product} />
            <p className="lvg-warning-copy">Questa azione non puo essere annullata.</p>
            <div className="lvg-modal-footer">
              <button className="lvg-cta lvg-cta--secondary" type="button" onClick={closeOverlay}>
                Torna indietro
              </button>
              <button className="lvg-cta lvg-cta--danger" type="button" onClick={runDelete}>
                Elimina definitivamente
              </button>
            </div>
          </div>
        </LvgModalShell>
      )}

      <LvgLoadingOverlay
        visible={isBusy}
        variant="modal"
        title="Stiamo aggiornando il banco..."
        message="Un attimo di pazienza, per offrirti il meglio."
      />
      <LvgErrorOverlay
        visible={Boolean(error)}
        variant="modal"
        title="Qualcosa e andato storto"
        message={closeErrorCopy}
        details={error || undefined}
        onRetry={lastAction || undefined}
        onClose={() => setError(null)}
      />
    </>
  );
};

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="lvg-info-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProductField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="lvg-field">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

function ProductMiniCard({ product }: { product: Product }) {
  return (
    <div className="lvg-mini-product">
      <img
        src={product.image || lvglogo}
        alt={`Foto di ${product.title}`}
        onError={(event) => {
          event.currentTarget.src = lvglogo;
        }}
      />
      <div>
        <strong>{product.title}</strong>
        <span>
          {formatPrice(product.price)} - {product.quantity ?? 0} pz
        </span>
      </div>
    </div>
  );
}

export default ProductItem;
export { ProductItem };
