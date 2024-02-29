import React from "react";
import Header from "../components/Header";
import LogInForm from "../components/LogInForm";
import { json, redirect } from 'react-router-dom'

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

async function action(request: Request) {
  const data = await request.formData()
  const authData = {
    email: data.get('email'),
    password: data.get('password')
  };

  const response = await fetch('https://lvg-onfood-default-rtdb.europe-west1.firebasedatabase.app/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(authData)
  })

  if (response.status === 401) {
    return response
  }

  if (!response.ok) {
    throw json({ message: 'Could not authenticate user.' }, { status: 500 });
  }

  return redirect('/')
}

export action;