import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/Home";
import LogInPage from "./pages/LogIn";
import RootLayout from "./pages/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LogInPage /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <section>
        <p>Product list in lavorazione...</p>
        <ol>
          <li>P1</li>
          <li>P2</li>
          <li>P3</li>
        </ol>
      </section>
      <aside>
        <p>Prodotti WIP in lavorazione...</p>
        <ol>
          <li>P1</li>
          <li>P2</li>
          <li>P3</li>
        </ol>
      </aside>
    </>
  );
}

export default App;
