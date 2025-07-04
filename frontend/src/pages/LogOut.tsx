import React from "react";
import { NavigateFunction } from "react-router-dom";
import { SignOutFunction } from "../store/context/auth-context";

const action = async (token: string, navigate: NavigateFunction, signOut: SignOutFunction  ) => {
  try {
    const response = await fetch("https://lvg-onfood-backend.onrender.com:8080/auth/logout-new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    console.log(response);
    if (response.status === 401) {
      throw "Non autenticato";
    }

    if (!response.ok) {
      throw "Log out non effettuato";
    }
  } catch (error: any) {
    console.log(error);
  }

  signOut(navigate)
};

export { action };
