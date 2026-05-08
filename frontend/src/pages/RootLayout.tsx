import React from "react";
import { Outlet } from "react-router-dom";
import { ConfirmDialog } from "primereact/confirmdialog";
import Items from "../UI/MenuBarUI";

function RootLayout() {
  return (
    <div className="lvg-page">
      <div className="lvg-bg-blobs" aria-hidden="true">
        <span className="lvg-bg-blob-bottom" />
      </div>
      <Items />
      <main className="lvg-main">
        <Outlet />
      </main>
      <ConfirmDialog tagKey="deleteProduct" />
      <ConfirmDialog tagKey="savingProduct" />
      <ConfirmDialog tagKey="prontoConfirm" />
      <ConfirmDialog tagKey="outOfStockConfirm" />
    </div>
  );
}

export default RootLayout;
