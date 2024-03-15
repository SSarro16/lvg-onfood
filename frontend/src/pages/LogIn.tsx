import React from "react";
import Header from "../components/Header";
import LogInForm from "../components/Form/LogInForm";

const LogInPage: React.FC = () => {
  return (
    <>
      <div>
        <Header
          title={"Log In"}
          message={"Inserisci email e password per autenticarti!"}
        />
      </div>
      <div>
        <LogInForm />
      </div>
    </>
  );
}

export default LogInPage;
