import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { AuthContext } from "../../store/context/auth-context";
import { fetchAddProduct } from "../../util/http";
import { useToast } from "../../store/context/toaster-context";
import { InputNumberValueChangeEvent } from "primereact/inputnumber";
import { Button } from "primereact/button";
import lvglogo from "../../assets/lvglogo.png";

type NewProductFormFields = {
  title: string;
  image: string;
  price: number;
  description: string;
};

const defaultFormFields: NewProductFormFields = {
  title: "",
  image: "",
  price: 0,
  description: "",
};

function NewProductForm() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getToken } = useContext(AuthContext);
  const [formFields, setFormFields] =
    useState<NewProductFormFields>(defaultFormFields);
  const { title, image, price, description } = formFields;

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormFields((prevState) => ({ ...prevState, [name]: value }));
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const errorHandler = (error: string) => {
    setIsSubmitting(false);
    showToast({
      severity: "error",
      summary: "New Product Error",
      detail: `New product creation failed: ${error}`,
      life: 3000,
    });
  };
  const successHandler = () => {
    setIsSubmitting(false);
    resetFormFields();
    navigate("/");
    showToast({
      severity: "success",
      summary: "New Product Success",
      detail: "New product creation successfully",
      life: 3000,
    });
  };
  const newProductSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const token = await getToken();
    if (token) {
      const bodyData: NewProductFormFields = {
        title,
        image,
        price,
        description,
      };
      console.log("New Product form data: ", { bodyData, token });
      await fetchAddProduct(token, bodyData, { errorHandler, successHandler });
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
    <Form
      method="post"
      onSubmit={newProductSubmitHandler}
      className="lvg-form-card"
    >
      <div className="lvg-form-grid">
        <div className="lvg-image-preview" aria-label="Anteprima immagine prodotto">
          <img
            src={image || lvglogo}
            alt={title || "Anteprima prodotto LVG"}
            onError={(event) => {
              event.currentTarget.src = lvglogo;
            }}
          />
        </div>

        <div className="lvg-field">
          <label htmlFor="title">Titolo prodotto</label>
          <InputText
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
          <label htmlFor="image">URL immagine</label>
          <InputText
            id="image"
            type="url"
            name="image"
            value={image}
            onChange={handleChange}
            required
            placeholder="https://..."
          />
        </div>

        <div className="lvg-field">
          <label htmlFor="price">Prezzo</label>
          <InputNumber
            inputId="price"
            name="price"
            value={price}
            mode="currency"
            currency="EUR"
            locale="it-IT"
            placeholder="Prezzo"
            required
            showButtons
            onValueChange={(e: InputNumberValueChangeEvent) =>
              setFormFields({ ...formFields, price: e.value ?? 0 })
            }
          />
        </div>

        <div className="lvg-field">
          <label htmlFor="description">Descrizione</label>
          <InputTextarea
            id="description"
            name="description"
            value={description}
            onChange={handleChange}
            required
            rows={4}
            autoResize
            placeholder="Ingredienti, preparazione o nota per il banco"
          />
        </div>

        <div className="lvg-form-actions">
          <Link className="p-button p-button-outlined" to="/">
            Torna alla Home
          </Link>
          <Button
            type="submit"
            label="Aggiungi prodotto"
            icon="pi pi-plus"
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </Form>
  );
}

export default NewProductForm;
