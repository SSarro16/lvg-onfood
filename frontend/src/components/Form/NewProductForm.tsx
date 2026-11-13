import React, { ChangeEvent, FormEvent, useContext, useMemo, useRef, useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/context/auth-context";
import { fetchAddProduct } from "../../util/http";
import { useToast } from "../../store/context/toaster-context";
import { useProducts } from "../../store/context/products-context";
import ProductCard from "../Products/ProductCard";
import {
  mapStatusToProduct,
  ProductFormFields,
  ProductFormStatus,
} from "../../util/productFormMapping";

const defaultFormFields: ProductFormFields = {
  title: "",
  image: "",
  price: 0,
  description: "",
  quantity: 10,
  estimatedCompletedTime: 25,
};

const statusOptions: {
  status: ProductFormStatus;
  title: string;
  kicker: string;
  description: string;
}[] = [
  {
    status: "available",
    title: "Disponibile",
    kicker: "Pronto al banco",
    description:
      "Il prodotto e gia acquistabile: devi indicare quanti pezzi sono disponibili.",
  },
  {
    status: "wip",
    title: "In lavorazione",
    kicker: "In cucina",
    description:
      "Il prodotto non e ancora pronto: devi indicare fra quanto uscira dalla cucina.",
  },
  {
    status: "unavailable",
    title: "Terminato",
    kicker: "Non disponibile",
    description:
      "Il prodotto e terminato: non serve indicare ne quantita ne tempo stimato.",
  },
];

const minutePresets = [5, 10, 15, 20, 25, 30, 45, 60, 90, 120];

function NewProductForm() {
  const { showToast } = useToast();
  const { refetchProducts } = useProducts();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken } = useContext(AuthContext);
  const [status, setStatus] = useState<ProductFormStatus>("available");
  const [formFields, setFormFields] =
    useState<ProductFormFields>(defaultFormFields);
  const [previewImage, setPreviewImage] = useState("");
  const { title, image, price, description, quantity, estimatedCompletedTime } =
    formFields;

  const mappedProduct = useMemo(
    () => mapStatusToProduct(formFields, status),
    [formFields, status]
  );

  const previewProduct = {
    ...mappedProduct,
    title: title || "Nuovo prodotto",
    image: previewImage || image,
    price,
    description: description || "Descrizione del prodotto visibile nel banco live.",
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormFields((prevState) => ({
      ...prevState,
      [name]: name === "price" ? Number(value) || 0 : value,
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(typeof reader.result === "string" ? reader.result : "");
    };
    reader.readAsDataURL(file);
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
    setStatus("available");
    setPreviewImage("");
  };

  const errorHandler = (error: string) => {
    setIsSubmitting(false);
    showToast({
      severity: "error",
      summary: "Errore prodotto",
      detail: `Creazione prodotto non riuscita: ${error}`,
      life: 3000,
    });
  };
  const successHandler = async () => {
    await refetchProducts();
    setIsSubmitting(false);
    resetFormFields();
    navigate("/menu-live");
    showToast({
      severity: "success",
      summary: "Prodotto pubblicato",
      detail: "Il prodotto e stato aggiunto al banco.",
      life: 3000,
    });
  };
  const newProductSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const token = await getToken();
    if (token) {
      await fetchAddProduct(token, mappedProduct, { errorHandler, successHandler });
    } else {
      setIsSubmitting(false);
      showToast({
        severity: "warn",
        summary: "Accesso richiesto",
        detail: "Effettua il login per aggiungere un prodotto.",
        life: 3000,
      });
    }
  };

  return (
    <div className="lvg-add-product-layout">
      <Form
        method="post"
        onSubmit={newProductSubmitHandler}
        className="lvg-form-card lvg-add-product-form"
      >
        <div className="lvg-form-grid">
          <div className="lvg-field">
            <label htmlFor="title">Titolo prodotto</label>
            <input
              id="title"
              type="text"
              name="title"
              value={title}
              required
              onChange={handleChange}
              placeholder="Es. Lasagne al forno"
            />
          </div>

          <div className="lvg-field">
            <label htmlFor="price">Prezzo (EUR)</label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={price}
              required
              onChange={handleChange}
              placeholder="8.50"
            />
          </div>

          <div className="lvg-field">
            <label htmlFor="description">Descrizione</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Ingredienti, preparazione o nota per il banco"
            />
          </div>

          <section className="lvg-photo-picker" aria-labelledby="photo-title">
            <div>
              <h2 id="photo-title">Foto prodotto</h2>
              <p>
                Carica o cambia la foto: la preview della card a destra si
                aggiorna subito.
              </p>
            </div>
            <button
              className="lvg-cta lvg-cta--secondary"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <i className="pi pi-upload" aria-hidden="true" />
              Cambia foto
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
            <div className="lvg-field lvg-image-compat-field">
              <label htmlFor="image">Compatibilita immagine</label>
              <input
                id="image"
                type="url"
                name="image"
                value={image}
                onChange={handleChange}
                placeholder="https://..."
              />
              <small>
                Se Firebase Storage non e configurato, il link mantiene la
                compatibilita con il campo image esistente.
              </small>
            </div>
          </section>

          <section className="lvg-status-picker" aria-labelledby="status-title">
            <h2 id="status-title">Stato prodotto</h2>
            <div className="lvg-status-options">
              {statusOptions.map((option) => (
                <button
                  key={option.status}
                  type="button"
                  className="lvg-status-option"
                  aria-pressed={status === option.status}
                  onClick={() => setStatus(option.status)}
                >
                  <strong>{option.title}</strong>
                  <span>{option.kicker}</span>
                  <p>{option.description}</p>
                </button>
              ))}
            </div>
          </section>

          {status === "available" && (
            <div className="lvg-field">
              <label htmlFor="quantity">Quanti pezzi sono disponibili?</label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(event) =>
                  setFormFields((prevState) => ({
                    ...prevState,
                    quantity: Math.max(1, Number(event.target.value) || 1),
                  }))
                }
              />
            </div>
          )}

          {status === "wip" && (
            <section className="lvg-minute-picker" aria-labelledby="minute-title">
              <h2 id="minute-title">Fra quanto esce dalla cucina?</h2>
              <div className="lvg-minute-presets">
                {minutePresets.map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    aria-pressed={estimatedCompletedTime === minutes}
                    onClick={() =>
                      setFormFields((prevState) => ({
                        ...prevState,
                        estimatedCompletedTime: minutes,
                      }))
                    }
                  >
                    {minutes} min
                  </button>
                ))}
              </div>
              <div className="lvg-field lvg-manual-minutes">
                <label htmlFor="estimatedCompletedTime">Manuale</label>
                <input
                  id="estimatedCompletedTime"
                  type="number"
                  min="1"
                  value={estimatedCompletedTime}
                  onChange={(event) =>
                    setFormFields((prevState) => ({
                      ...prevState,
                      estimatedCompletedTime: Math.max(
                        1,
                        Number(event.target.value) || 1
                      ),
                    }))
                  }
                />
                <span>min</span>
              </div>
              <p className="lvg-helper-note">
                Il valore e espresso in minuti, non in secondi. Esempio: 25 =
                pronto tra 25 minuti.
              </p>
            </section>
          )}

          {status === "unavailable" && (
            <section className="lvg-terminated-box" aria-labelledby="terminated-title">
              <i className="pi pi-times" aria-hidden="true" />
              <div>
                <h2 id="terminated-title">Prodotto terminato</h2>
                <p>
                  Non devi inserire ne quantita ne tempo stimato. Nel dataset
                  corrisponde a quantita 0 e tempo stimato 0.
                </p>
              </div>
            </section>
          )}

          <div className="lvg-form-actions">
            <Link className="p-button p-button-outlined" to="/">
              Torna alla Home
            </Link>
            <button
              className="lvg-cta lvg-cta--secondary"
              type="button"
              onClick={() =>
                showToast({
                  severity: "info",
                  summary: "Bozza locale",
                  detail: "La bozza resta su questa pagina finché non pubblichi.",
                  life: 2500,
                })
              }
            >
              Salva bozza
            </button>
            <button
              className="lvg-cta lvg-cta--primary"
              type="submit"
              disabled={isSubmitting}
            >
              <i className="pi pi-plus" aria-hidden="true" />
              {isSubmitting ? "Pubblico..." : "Pubblica prodotto"}
            </button>
          </div>
        </div>
      </Form>

      <aside className="lvg-preview-panel" aria-label="Preview live prodotto">
        <div className="lvg-preview-panel__sticky">
          <div className="lvg-preview-card-shell">
            <span>Preview live card</span>
            <p>
              Qui vedi come apparira il prodotto nel banco, con tutte le info
              inserite nel form.
            </p>
            <ProductCard product={previewProduct} />
          </div>
          <ul className="lvg-preview-notes">
            <li>Disponibile: la card entra nel Menù live e mostra i pezzi pronti.</li>
            <li>In lavorazione: la card mostra il tempo stimato di uscita dalla cucina.</li>
            <li>Terminato: la card resta fuori dal Menù live pubblico.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default NewProductForm;
