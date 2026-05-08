import React from "react";
import { Button } from "primereact/button";

type LvgErrorOverlayProps = {
  visible?: boolean;
  title?: string;
  message?: string;
  onRetry?: () => void;
  actionLabel?: string;
  details?: string;
  variant?: "page" | "inline" | "modal";
};

export default function LvgErrorOverlay({
  visible = true,
  title = "Qualcosa e andato storto.",
  message = "Non siamo riusciti ad aggiornare il banco. Riprova tra qualche secondo.",
  onRetry,
  actionLabel = "Riprova",
  details,
  variant = "page",
}: LvgErrorOverlayProps) {
  if (!visible) return null;

  return (
    <div className={`lvg-error lvg-error--${variant}`} role="alert">
      <div className="lvg-error__card">
        <span className="lvg-error__icon pi pi-exclamation-triangle" aria-hidden="true" />
        <div>
          <h2>{title}</h2>
          <p>{message}</p>
          {details && process.env.NODE_ENV === "development" && (
            <pre>{details}</pre>
          )}
        </div>
        {onRetry && (
          <Button
            type="button"
            label={actionLabel}
            icon="pi pi-refresh"
            onClick={onRetry}
          />
        )}
      </div>
    </div>
  );
}
