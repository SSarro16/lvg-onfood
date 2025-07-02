import React from "react";
import ReactDOM from "react-dom/client";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";

import "./index.css";
import App from "./App";

import { Provider } from "react-redux";
import store from "./store/redux";
import { AuthProvider } from "./store/context/auth-context";
import { ToastProvider } from "./store/context/toaster-context";
import LangProvider from "./store/context/lang-context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <PrimeReactProvider>
      <ToastProvider>
        <Provider store={store}>
          <AuthProvider>
            <LangProvider>
              <App />
            </LangProvider>
          </AuthProvider>
        </Provider>
      </ToastProvider>
    </PrimeReactProvider>
  </React.StrictMode>
);
