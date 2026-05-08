import React from "react";

import lvglogo from "../../assets/lvglogo.png";

import type { HeaderComponentProps } from "./types";

const Header: React.FC<HeaderComponentProps> = (props) => {
  return (
    <header className="lvg-hero">
      <div className="lvg-hero__copy">
        <h1>{props.title}</h1>
        <p>{props.message}</p>
      </div>
      <aside className="lvg-hero__panel" aria-label="Lo Verde Gastronomy">
        <img src={lvglogo} alt="Logo Lo Verde Gastronomy" />
        <div className="lvg-hero__panel-body">
          <span className="lvg-status lvg-status--available">
            <i className="pi pi-wifi" aria-hidden="true" />
            Banco aggiornato live
          </span>
          <p>
            Prodotti disponibili, in preparazione e terminati restano leggibili
            in un unico banco digitale.
          </p>
        </div>
      </aside>
    </header>
  );
};

export default Header;
