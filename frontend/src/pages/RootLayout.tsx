import React from "react";
import MainNavigator from '../components/Navigator Bar/MainNavigator';
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <>
      <MainNavigator />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default RootLayout;