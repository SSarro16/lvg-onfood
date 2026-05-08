import React from "react";
import { Outlet } from "react-router-dom";
import Items from "../UI/MenuBarUI";

function RootLayout() {
  return (
    <div className="lvg-shell">
      <Items />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;
