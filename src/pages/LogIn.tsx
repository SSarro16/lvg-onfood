import React from "react";
import Header from "../components/Header";
import LogInForm from "../components/LogInForm";

export default function LogInPage() {
  return (
    <>
      <div>
        <Header title={"Log In"} message={"Log In Page in lavorazione..."} />
      </div>
      <div>
        <LogInForm />
      </div>
    </>
  );
}
