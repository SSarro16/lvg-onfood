import React from "react";
import Header from "../components/Header";

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
      <section>
        <p>Product list in lavorazione...</p>
        <ol>
          <li>P1</li>
          <li>P2</li>
          <li>P3</li>
        </ol>
      </section>
      <aside>
        <p>Prodotti WIP in lavorazione...</p>
        <ol>
          <li>P1</li>
          <li>P2</li>
          <li>P3</li>
        </ol>
      </aside>
    </>
  );
}
