import React, { ChangeEvent, useState } from "react";
import { Product } from "../../store/redux/products-slice";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { fetchDeleteProduct, fetchUpdateProduct } from "../../util/http";
import { InputText } from "primereact/inputtext";
import {
  InputNumber,
  InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { useToast } from "../../store/context/toaster-context";
import { useLang } from "../../store/context/lang-context";
import { useProducts } from "../../store/context/products-context";
import {
  getProductStatus,
  getProductStatusIcon,
  getProductStatusLabel,
} from "../../util/productStatus";
import lvglogo from "../../assets/lvglogo.png";
import LvgLoadingOverlay from "../UI/LvgLoadingOverlay";

type ProductItemProps = { product: Product; token?: string };

type ProductFormFields = {
  title: string;
  image: string;
  price: number;
  description: string;
  quantity: number;
  estimatedCompletedTime: number;
};

const emptyFormFields: ProductFormFields = {
  title: "",
  image: "",
  price: 0,
  description: "",
  quantity: 0,
  estimatedCompletedTime: 0,
};

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

const ProductItem: React.FC<ProductItemProps> = ({ product, token }) => {
  const { showToast } = useToast();
  const { refetchProducts } = useProducts();
  const { t: translate } = useLang();
  const [detailVisible, setDetailVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [readyVisible, setReadyVisible] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [formFields, setFormFields] = useState<ProductFormFields>(emptyFormFields);
  const [readyQuantity, setReadyQuantity] = useState(product.quantity ?? 0);

  const status = getProductStatus(product);
  const statusLabel = getProductStatusLabel(status);
  const hasToken = Boolean(token);
  const description = product.description || "Descrizione non disponibile.";
  const quantity = product.quantity ?? 0;
  const estimatedCompletedTime = product.estimatedCompletedTime ?? 0;

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
    event: InputNumberValueChangeEvent
  ) => {
    setFormFields((prevState) => ({
      ...prevState,
      [name]: event.value ?? 0,
    }));
  };

  const successSavingHandler = async () => {
    setIsBusy(false);
    setEditVisible(false);
    setReadyVisible(false);
    setDetailVisible(false);
    await refetchProducts();
    showToast({
      severity: "success",
      summary: "Banco aggiornato",
      detail: "Il prodotto e stato salvato correttamente.",
      life: 2500,
    });
  };

  const errorSavingHandler = () => {
    setIsBusy(false);
    showToast({
      severity: "error",
      summary: "Salvataggio non riuscito",
      detail: "Non siamo riusciti a salvare il prodotto. Riprova.",
      life: 3000,
    });
  };

  const successDeleteHandler = async () => {
    setIsBusy(false);
    setDetailVisible(false);
    await refetchProducts();
    showToast({
      severity: "success",
      summary: "Prodotto eliminato",
      detail: "Il banco e stato aggiornato.",
      life: 2500,
    });
  };

  const errorDeleteHandler = () => {
    setIsBusy(false);
    showToast({
      severity: "error",
      summary: "Eliminazione non riuscita",
      detail: "Non siamo riusciti a eliminare il prodotto. Riprova.",
      life: 3000,
    });
  };

  const saveProduct = async (bodyData: ProductFormFields) => {
    if (!token) return;
    setIsBusy(true);
    await fetchUpdateProduct(token, product.id, bodyData, {
      errorSavingHandler,
      successSavingHandler,
    });
  };

  const openEditConfirmation = () => {
    confirmDialog({
      tagKey: "editProduct",
      message: translate("edit_mess"),
      header: translate("edit_head"),
      icon: "pi pi-pencil",
      defaultFocus: "reject",
      acceptClassName: "p-button-warning",
      acceptLabel: translate("edit_acceptlabel"),
      accept: () => {
        setFormFields(productToFormFields(product));
        setEditVisible(true);
        setDetailVisible(false);
      },
    });
  };

  const openSaveConfirmation = () => {
    confirmDialog({
      tagKey: "savingProduct",
      message: translate("saving_mess"),
      header: translate("saving_head"),
      icon: "pi pi-save",
      defaultFocus: "reject",
      acceptLabel: translate("saving_acceptlabel"),
      accept: () => saveProduct(formFields),
    });
  };

  const openDeleteConfirmation = () => {
    confirmDialog({
      tagKey: "deleteProduct",
      message: translate("delete_mess"),
      header: translate("delete_head"),
      icon: "pi pi-trash",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      acceptLabel: translate("delete_acceptlabel"),
      accept: async () => {
        if (!token) return;
        setIsBusy(true);
        await fetchDeleteProduct(token, product.id, {
          errorDeleteHandler,
          successDeleteHandler,
        });
      },
    });
  };

  const openReadyConfirmation = () => {
    confirmDialog({
      tagKey: "prontoConfirm",
      message: translate("pronto_mess"),
      header: translate("pronto_head"),
      icon: "pi pi-check-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-success",
      acceptLabel: translate("pronto_acceptlabel"),
      accept: () => {
        setReadyQuantity(Math.max(quantity, 1));
        setReadyVisible(true);
      },
    });
  };

  const openOutOfStockConfirmation = () => {
    confirmDialog({
      tagKey: "outOfStockConfirm",
      message: "Vuoi segnare questo prodotto come terminato?",
      header: "Prodotto terminato",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      acceptLabel: "Conferma",
      accept: () =>
        saveProduct({
          ...productToFormFields(product),
          quantity: 0,
          estimatedCompletedTime: 0,
        }),
    });
  };

  const adminActions = hasToken ? (
    <div className="lvg-product-card__actions">
      <Button
        label="Modifica"
        icon="pi pi-pencil"
        outlined
        onClick={openEditConfirmation}
      />
      <Button
        label={translate("delete_button")}
        icon="pi pi-trash"
        severity="danger"
        outlined
        onClick={openDeleteConfirmation}
      />
      {estimatedCompletedTime > 0 && (
        <Button
          label={translate("pronto_button")}
          icon="pi pi-check"
          severity="success"
          onClick={openReadyConfirmation}
        />
      )}
      {quantity > 0 && (
        <Button
          label="Terminato"
          icon="pi pi-times"
          severity="warning"
          onClick={openOutOfStockConfirmation}
        />
      )}
    </div>
  ) : null;

  return (
    <>
      <ConfirmDialog tagKey="deleteProduct" />
      <ConfirmDialog tagKey="editProduct" />
      <ConfirmDialog tagKey="savingProduct" />
      <ConfirmDialog tagKey="prontoConfirm" />
      <ConfirmDialog tagKey="outOfStockConfirm" />

      <article className={`lvg-product-card lvg-product-card--${status}`}>
        <img
          className="lvg-product-card__image"
          src={product.image || lvglogo}
          alt={product.title || "Prodotto gastronomia LVG"}
          onError={(event) => {
            event.currentTarget.src = lvglogo;
          }}
        />
        <div className="lvg-product-card__body">
          <span className={`lvg-status lvg-status--${status}`}>
            <i className={getProductStatusIcon(status)} aria-hidden="true" />
            {statusLabel}
          </span>
          <div>
            <h3>{product.title}</h3>
            <p>{description}</p>
          </div>
          {status === "wip" && (
            <strong className="lvg-status lvg-status--wip">
              Pronto tra {estimatedCompletedTime} min
            </strong>
          )}
          <div className="lvg-product-card__meta">
            <span className="lvg-price">{formatPrice(product.price)}</span>
            <span>{quantity > 0 ? `${quantity} pz disponibili` : "Non disponibile"}</span>
          </div>
          <Button
            label="Vedi dettaglio"
            icon="pi pi-eye"
            onClick={() => setDetailVisible(true)}
          />
        </div>
      </article>

      <Dialog
        header={product.title}
        visible={detailVisible}
        modal
        onHide={() => setDetailVisible(false)}
        footer={adminActions}
      >
        {isBusy && (
          <LvgLoadingOverlay
            variant="inline"
            title="Aggiorno il prodotto..."
            message="Il banco verra ricaricato tra un momento."
          />
        )}
        {!isBusy && (
          <div className="lvg-form-grid">
            <img
              className="lvg-product-card__image"
              src={product.image || lvglogo}
              alt={product.title}
              onError={(event) => {
                event.currentTarget.src = lvglogo;
              }}
            />
            <span className={`lvg-status lvg-status--${status}`}>
              <i className={getProductStatusIcon(status)} aria-hidden="true" />
              {statusLabel}
            </span>
            <p>{description}</p>
            <div className="lvg-product-card__meta">
              <strong>{formatPrice(product.price)}</strong>
              <span>Quantita: {quantity} pz</span>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        header="Modifica prodotto"
        visible={editVisible}
        modal
        onHide={() => setEditVisible(false)}
        footer={
          <div className="lvg-form-actions">
            <Button
              label="Annulla"
              icon="pi pi-times"
              severity="secondary"
              outlined
              onClick={() => setEditVisible(false)}
            />
            <Button
              label="Salva"
              icon="pi pi-check"
              onClick={openSaveConfirmation}
              loading={isBusy}
            />
          </div>
        }
      >
        <div className="lvg-form-grid">
          <div className="lvg-field">
            <label htmlFor={`image-${product.id}`}>Immagine</label>
            <InputText
              id={`image-${product.id}`}
              name="image"
              type="url"
              value={formFields.image}
              onChange={handleTextChange}
              required
            />
          </div>
          <div className="lvg-field">
            <label htmlFor={`title-${product.id}`}>Titolo</label>
            <InputText
              id={`title-${product.id}`}
              name="title"
              value={formFields.title}
              onChange={handleTextChange}
              required
            />
          </div>
          <div className="lvg-field">
            <label htmlFor={`description-${product.id}`}>Descrizione</label>
            <InputTextarea
              id={`description-${product.id}`}
              name="description"
              value={formFields.description}
              onChange={handleTextChange}
              rows={4}
              autoResize
            />
          </div>
          <div className="lvg-field">
            <label htmlFor={`price-${product.id}`}>Prezzo</label>
            <InputNumber
              inputId={`price-${product.id}`}
              value={formFields.price}
              mode="currency"
              currency="EUR"
              locale="it-IT"
              onValueChange={(event) => handleNumberChange("price", event)}
              required
            />
          </div>
          <div className="lvg-field">
            <label htmlFor={`quantity-${product.id}`}>Quantita</label>
            <InputNumber
              inputId={`quantity-${product.id}`}
              value={formFields.quantity}
              showButtons
              min={0}
              onValueChange={(event) => handleNumberChange("quantity", event)}
            />
          </div>
          <div className="lvg-field">
            <label htmlFor={`estimated-${product.id}`}>Tempo stimato</label>
            <InputNumber
              inputId={`estimated-${product.id}`}
              value={formFields.estimatedCompletedTime}
              suffix=" min"
              min={0}
              showButtons
              onValueChange={(event) =>
                handleNumberChange("estimatedCompletedTime", event)
              }
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        header="Imposta nuova quantita"
        visible={readyVisible}
        modal
        onHide={() => setReadyVisible(false)}
        footer={
          <div className="lvg-form-actions">
            <Button
              label="Annulla"
              icon="pi pi-times"
              severity="secondary"
              outlined
              onClick={() => setReadyVisible(false)}
            />
            <Button
              label="Salva"
              icon="pi pi-check"
              loading={isBusy}
              onClick={() =>
                saveProduct({
                  ...productToFormFields(product),
                  quantity: readyQuantity,
                  estimatedCompletedTime: 0,
                })
              }
            />
          </div>
        }
      >
        <div className="lvg-field">
          <label htmlFor={`ready-quantity-${product.id}`}>
            Nuova quantita disponibile
          </label>
          <InputNumber
            inputId={`ready-quantity-${product.id}`}
            value={readyQuantity}
            showButtons
            min={0}
            onValueChange={(event) => setReadyQuantity(event.value ?? 0)}
          />
        </div>
      </Dialog>
    </>
  );
};

export default ProductItem;

export { ProductItem };
