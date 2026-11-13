import React from "react";
import LvgIcon from "./LvgIcon";
import LvgModalShell from "./LvgModalShell";

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

  const content = (
    <div className={`lvg-loading lvg-loading--${variant}`} role="status" aria-live="polite">
      <div className="lvg-loading__card">
        <span className="lvg-loading__mark">
          <LvgIcon name="chef" />
        </span>
        <span className="lvg-loading__spinner" aria-hidden="true" />
        <div>
          <h2>{title}</h2>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );

  if (variant === "modal") {
    return (
      <LvgModalShell size="small" tone="dark">
        {content}
      </LvgModalShell>
    );
  }

  return content;
}
