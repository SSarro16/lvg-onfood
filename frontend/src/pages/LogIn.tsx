import React from "react";
import LogInForm from "../components/Form/LogInForm";
import { useLang } from "../store/context/lang-context";

const LogInPage: React.FC = () => {
  const {t: translate} = useLang()
  return (
    <section className="lvg-auth">
      <div className="lvg-auth__intro">
        <h1>Accesso banco LVG</h1>
        <p>{translate('login_mess')}</p>
        <p>
          Entra per aggiornare disponibilita, preparazioni, prodotti terminati e
          schede del banco gastronomia.
        </p>
      </div>
      <div>
        <LogInForm />
      </div>
    </section>
  );
}

export default LogInPage;
