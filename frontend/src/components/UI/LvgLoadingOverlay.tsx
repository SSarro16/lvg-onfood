import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

type LvgLoadingOverlayProps = {
  visible?: boolean;
  title?: string;
  message?: string;
  variant?: "page" | "inline" | "modal";
};

export default function LvgLoadingOverlay({
  visible = true,
  title = "Stiamo aggiornando il banco...",
  message = "Carico i prodotti del giorno.",
  variant = "page",
}: LvgLoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div className={`lvg-loading lvg-loading--${variant}`} role="status" aria-live="polite">
      <div className="lvg-loading__card">
        <span className="lvg-loading__mark">LVG</span>
        <ProgressSpinner
          className="lvg-loading__spinner"
          strokeWidth="5"
          animationDuration=".7s"
        />
        <div>
          <h2>{title}</h2>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}
