import { redirect } from "react-router-dom";

export function getAuthToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }
}

export function tokenLoader() {
  const token = getAuthToken();
  return token;
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect("/login");
  }

  return null;
}
