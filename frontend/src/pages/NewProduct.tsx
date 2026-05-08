import React from "react";
import NewProductForm from "../components/Form/NewProductForm";

function NewProductPage() {
  return (
    <section className="lvg-form-page">
      <div className="lvg-form-page__intro">
        <h1>Nuovo prodotto</h1>
        <p>
          Aggiungi una scheda chiara per il banco LVG. I dati restano compatibili
          con il dataset esistente.
        </p>
      </div>
      <NewProductForm />
    </section>
  );
}

export default NewProductPage;
