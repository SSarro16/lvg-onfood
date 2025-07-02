import React from "react";
import Header from "../components/Header";
import LogInForm from "../components/Form/LogInForm";
import { useLang } from "../store/context/lang-context";

const LogInPage: React.FC = () => {
  const {t: translate, lang} = useLang()
  return (
    <>
      <div>
        <Header
          title={"Log In"}
          message={translate('login_mess')}
        />
      </div>
      <div>
        <LogInForm />
      </div>
    </>
  );
}

export default LogInPage;
