import React, { FormEvent, useContext, useState } from "react";
import {
  Form,
  useNavigation,
  Link,
  useNavigate,
} from "react-router-dom";
import classes from "./Form.module.css";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { AuthContext } from "../../store/context/auth-context";


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

  const newProductSubmitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = await getToken();
    if (token) {
      const prodData = {
        title,
        image,
        price,
        description,
      };
      let response: Response | undefined;
      let error: any;
      try {
        response = await fetch("http://localhost:8080/products/new", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(prodData),
        });

        const resData = response.json();
        console.log(resData);
      } catch (thisError: any) {
        response = undefined;
        error = thisError;
      }
      
      console.log(response);
      if (response) {
        if (response.status === 401) {
          // 401 Unauthorized
          // TODO: Handle Errors (Toasts)
        } else if (!response.ok) {
          // throw json({ message: "Could not create new product." }, { status: 500 });
          // TODO: Handle Errors (Toasts)
        } else {
          // success
          // TODO: Handle Success (Toasts)
          resetFormFields();
          navigate("/");
        }
      } else {
        // error while fetching
        // TODO: Handle Errors (Toasts)
        console.log(error.message || "Error while fetching");
      }
    } else {
      // TODO: Handle Errors (Toasts)
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
                value={title}
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
                required
                defaultValue={event ? event.image : ""}
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
                type="number"
                name="price"
                required
                defaultValue={event ? event.price : ""}
                placeholder="Price"
              />
              <span className="p-inputgroup-addon">
                <i className="pi pi-euro"></i>
              </span>
            </div>
          </div>
        </div>
        <div className="grid p-fluid">
          <div className="col-12">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon ">
                <i className="pi pi-pencil" />
              </span>
              <InputTextarea
                id="description"
                name="description"
                required
                className="w-full"
                defaultValue={event ? event.description : ""}
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
