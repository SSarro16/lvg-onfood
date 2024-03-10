import React from "react";
import {
  redirect,
  json,
  useRouteLoaderData,
  NavigateFunction,
} from "react-router-dom";

const action = async (token: string, navigate: NavigateFunction) => {
  const response = await fetch("http://localhost:8080/logout", {
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

  localStorage.removeItem("token");
  navigate("/");
};
export { action };
