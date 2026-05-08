import React from "react";
import NewProductForm from "../components/Form/NewProductForm";

function NewProductPage() {
  return (
    <section className="lvg-form-page">
      <div className="lvg-form-page__intro">
        <span className="lvg-hero__badge">
          <i className="pi pi-pencil" aria-hidden="true" />
          Admin banco
        </span>
        <h1>Aggiungi prodotto</h1>
        <p>
          Una pagina pulita per inserire nuovi prodotti scegliendo prima lo
          stato corretto del banco: disponibile, in lavorazione o terminato.
        </p>
      </div>
      <NewProductForm />
    </section>
  );
}

export default NewProductPage;
