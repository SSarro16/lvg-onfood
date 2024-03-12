import React from "react";
import Header from "../components/Header";
import LogInForm from "../components/Form/LogInForm";
import {
  ActionFunction,
  ActionFunctionArgs,
  json,
  redirect,
} from "react-router-dom";

const backendUrl = "http://localhost:8080";
export default function LogInPage() {
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
type LoginResBody = { token: string };

const action: ActionFunction<ActionFunctionArgs> = async (args) => {
  const data = await args.request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  try {
    const response = await fetch(`${backendUrl}/auth/login-new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authData),
    });

    if (response.status === 401) {
      return response;
    }

    if (!response.ok) {
      throw json({ message: "Could not authenticate user." }, { status: 500 });
    }
    const resData: LoginResBody = await response.json();
    console.log(resData)
    const token = resData.token
    localStorage.setItem("token", token);
  } catch (error: any) {
    console.log(error);
  }

  
  return redirect("/");
};

export { action };
