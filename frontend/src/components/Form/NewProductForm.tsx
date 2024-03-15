import React, { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Form, useNavigation, Link, useNavigate } from "react-router-dom";
import classes from "./Form.module.css";
import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import { InputText, InputTextProps } from "primereact/inputtext";
import { InputTextarea, InputTextareaProps } from "primereact/inputtextarea";
import { AuthContext } from "../../store/context/auth-context";
import { fetchAddProduct } from "../../util/http";

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
    console.log("error");
    throw new Error("Impossible to add product");
  };
  const successHandler = () => {
    console.log("success");
    resetFormFields();
    navigate("/");
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
      method="post"
      className={classes.form}
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
                onValueChange={(e: any) => setFormFields({...formFields, price: e.value })}
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
        <button disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Aggiungi nuovo prodotto"}
        </button>
      </div>
    </Form>
  );
}

export default NewProductForm;
