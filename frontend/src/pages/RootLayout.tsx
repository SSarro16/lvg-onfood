import React from "react";
import { Outlet } from "react-router-dom";
import Items from "../UI/MenuBarUI";

function RootLayout() {
  return (
    <>
      <Items />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;
