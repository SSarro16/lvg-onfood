import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Product from "../components/Products/Products";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function HomePage() {
  const products = useSelector((state: RootState) => state.products.products)

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
        <section>
          <h2>Product list in lavorazione...</h2>
          <Product />
        </section>
        <aside>
          <h3>Prodotti WIP in lavorazione...</h3>
          <ol>
            <li>P1</li>
            <li>P2</li>
            <li>P3</li>
          </ol>
        </aside>
      </div>
    </>
  );
}
