import NewProductForm from "../components/Form/NewProductForm";
import React, { useEffect, useState } from "react";
import { ActionFunction, json, redirect } from "react-router-dom";
import { AuthContext } from "../components/Firebase/context/auth-context";

function NewProductPage() {
  return <NewProductForm />;
}

export default NewProductPage;

const action: ActionFunction = async (args) => {
  const token = localStorage.getItem("token");
  const data = await args.request.formData();

  console.log("New Product Action Token: ", token);
  const prodData = {
    title: data.get("title"),
    image: data.get("image"),
    price: data.get("price"),
    description: data.get("description"),
  };

  const response = await fetch("http://localhost:8080/products/new", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(prodData),
  });

  const resData = response.json();
  console.log(resData);

  console.log(response);
  if (response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: "Could not create new product." }, { status: 500 });
  }

  return redirect("/");
};

export { action };
