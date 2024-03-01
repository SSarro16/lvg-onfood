import { redirect } from "react-router-dom";

const getAuthToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  return token;
}

export {getAuthToken}

const tokenLoader = () => {
  const token = getAuthToken();
  return token;
}

export {tokenLoader}

const checkAuthLoader = () => {
  const token = getAuthToken();

  if (!token) {
    return redirect("/login");
  }

  return null;
}

export {checkAuthLoader}