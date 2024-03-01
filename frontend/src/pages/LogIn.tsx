import React from "react";
import Header from "../components/Header";
import LogInForm from "../components/Form/LogInForm";
import { ActionFunction, json, redirect } from 'react-router-dom'

const backendUrl = "http://localhost:8080"
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
type LoginResBody = {token: string };

const action: ActionFunction<any> = async (args) => {
  const data = await args.request.formData()
  const authData = {
    email: data.get('email'),
    password: data.get('password')
  };

  const response = await fetch(`${backendUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(authData)
  })

  console.log(response)
  if (response.status === 401) {
    return response
  }

  if (!response.ok) {
    throw json({ message: 'Could not authenticate user.' }, { status: 500 });
  }
  const resData: LoginResBody  = await response.json();
  const token = resData.token;
  localStorage.setItem('token', token)

  return redirect('/')
}

export {action};