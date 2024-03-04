import React from "react";
import { Form, useNavigation, Link } from "react-router-dom";
import classes from "./Form.module.css";

function NewProductForm(event: any) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post" className={classes.form}>
      <p>
        <label htmlFor="title">Product Title</label>
        <input
          id="title"
          type="text"
          name="title"
          required
          defaultValue={event ? event.title : ""}
        />
      </p>
      <p>
        <label htmlFor="image">Product Image</label>
        <input
          id="image"
          type="url"
          name="image"
          required
          defaultValue={event ? event.image : ""}
        />
      </p>
      <p>
        <label htmlFor="price">Price</label>
        <input
          id="price"
          type="number"
          name="price"
          required
          defaultValue={event ? event.price : ""}
        />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          required
          defaultValue={event ? event.description : ""}
        />
      </p>
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
