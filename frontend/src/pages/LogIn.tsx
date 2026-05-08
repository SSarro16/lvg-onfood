import React from "react";
import LogInForm from "../components/Form/LogInForm";
import { useLang } from "../store/context/lang-context";
import lvglogo from "../assets/lvglogo.png";

const LogInPage: React.FC = () => {
  const {t: translate} = useLang()
  return (
    <section className="lvg-auth">
      <div className="lvg-auth__panel">
        <span className="lvg-auth__brand" aria-hidden="true">
          <img src={lvglogo} alt="" />
        </span>
        <span className="lvg-hero__badge">
          <i className="pi pi-lock" aria-hidden="true" />
          Area riservata
        </span>
        <h1>Accesso banco digitale.</h1>
        <p>{translate('login_mess')}</p>
        <p>
          Una pagina login piu coerente col brand, pensata per chi aggiorna
          prodotti, quantita e preparazioni del giorno.
        </p>
        <div className="lvg-auth__points" aria-label="Funzioni amministratore">
          <span><i className="pi pi-pencil" aria-hidden="true" />Admin · Gestione prodotti</span>
          <span><i className="pi pi-bolt" aria-hidden="true" />Live · Aggiornamenti rapidi</span>
        </div>
      </div>
      <div>
        <LogInForm />
      </div>
    </section>
  );
}

export default LogInPage;
