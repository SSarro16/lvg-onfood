import NewProductForm from "../components/Form/NewProductForm";
import { ActionFunction, json, redirect } from "react-router-dom";
import React from "react";
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";

function NewProductPage() {
  return <NewProductForm />;
}

export default NewProductPage;

const action: ActionFunction<any> = async (args) => {
  const data = await args.request.formData();
  const prodData = {
    id: uuidv4(),
    title: data.get("title"),
    image: data.get("image"),
    price: data.get("price"),
    description: data.get("description"),
  };

  const response = await fetch("http://localhost:8080/products", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
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
