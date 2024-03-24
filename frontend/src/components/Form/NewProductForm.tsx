import React, {
  ChangeEvent,
  FormEvent,
  useContext,
  useRef,
  useState,
} from "react";
import { Form, useNavigation, Link, useNavigate } from "react-router-dom";
import classes from "./Form.module.css";
import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import { InputText, InputTextProps } from "primereact/inputtext";
import { InputTextarea, InputTextareaProps } from "primereact/inputtextarea";
import { AuthContext } from "../../store/context/auth-context";
import { fetchAddProduct } from "../../util/http";
import { Toast } from "primereact/toast";

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

function NewProductForm(event: any) {
  const toast = useRef<Toast>(null);
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "submitting";
  const { getToken } = useContext(AuthContext);
  const [formFields, setFormFields] =
    useState<NewProductFormFields>(defaultFormFields);
  const { title, image, price, description } = formFields;

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFormFields((prevState) => ({ ...prevState, [name]: value }));
  };

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const errorHandler = () => {
    toast.current?.show({
      severity: "error",
      summary: "New Product Error",
      detail: "New product creation failed",
      life: 3000,
    });
  };
  const successHandler = () => {
    resetFormFields();
    navigate("/");
    toast.current?.show({
      severity: "success",
      summary: "New Product Success",
      detail: "New product creation successfully",
      life: 3000,
    });
  };
  const newProductSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = await getToken();
    if (token) {
      const bodyData: NewProductFormFields = {
        title,
        image,
        price,
        description,
      };
      console.log("New Product form data: ", { bodyData, token });
      fetchAddProduct(token, bodyData, { errorHandler, successHandler });
    }
  };

  return (
    <Form
      className={classes.form}
      method="post"
      onSubmit={newProductSubmitHandler}
    >
      <div className="card">
        <div className="grid p-fluid">
          <div className="col-12">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-file-edit" />
              </span>
              <InputText
                id="title"
                type="text"
                name="title"
                required
                onChange={handleChange}
                placeholder="Title"
              />
            </div>
          </div>
        </div>

        <div className="grid p-fluid">
          <div className="col-12">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-image" />
              </span>
              <InputText
                id="image"
                type="url"
                name="image"
                onChange={handleChange}
                required
                placeholder="url"
              />
            </div>
          </div>
        </div>
        <div className="grid">
          <div className="col-12">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-money-bill"></i>
              </span>
              <InputNumber
                id="price"
                name="price"
                mode="currency"
                currency="EUR"
                locale="it-IT"
                placeholder="Price"
                required
                onValueChange={(e: any) =>
                  setFormFields({ ...formFields, price: e.value })
                }
              />
            </div>
          </div>
        </div>
        <div className="grid p-fluid">
          <div className="col-12">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon ">
                <i className="pi pi-pencil" />
              </span>
              <InputText
                id="description"
                name="description"
                type="textarea"
                onChange={handleChange}
                required
                placeholder="Description"
              />
            </div>
          </div>
        </div>
      </div>

      <div className={classes.actions}>
        <Link to="/">Torna alla Home</Link>
        <Toast ref={toast} />
        <button disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Aggiungi nuovo prodotto"}
        </button>
      </div>
    </Form>
  );
}

export default NewProductForm;
