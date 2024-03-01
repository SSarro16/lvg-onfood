import React from "react";
import Header from "../components/Header";
import Product from "../components/Products/Product";

export default function HomePage() {
  return (
    <>
      <div>
        <Header
          title={"Benvenuti al LVG Online Food"}
          message={
            "Qui potrai prenotare e visionare tutti i prodotti offerti dal nostro servizio di gastronomia e sarai aggiornato anche sui prodotti che sono in lavorazione"
          }
        />
      </div>
      <div style={{ display: "flex" }}>
        <h2>Product list in lavorazione...</h2>
        <Product />
        <h3>Prodotti WIP in lavorazione...</h3>
        <ol>
          <li>P1</li>
          <li>P2</li>
          <li>P3</li>
        </ol>
      </div>
    </>
  );
}
