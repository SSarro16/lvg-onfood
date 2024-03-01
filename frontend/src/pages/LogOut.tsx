import { redirect, json } from "react-router-dom";

const action = async () => {
  const response =  await fetch("http://localhost:8080/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    return response
  }

  if (!response.ok) {
    throw json({ message: 'Could not logged user.' }, { status: 500 });
  }

  localStorage.removeItem("token");
  return (redirect("/"));
};

export {action};
