import React from "react";
import { Form, useNavigation, Link, useActionData } from "react-router-dom";
import classes from "./Form.module.css";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";

function NewProductForm(event: any) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const data = useActionData();
  console.log("data is: ", data);

  return (
    <Form method="post" className={classes.form}>
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
                defaultValue={event ? event.title : ""}
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
