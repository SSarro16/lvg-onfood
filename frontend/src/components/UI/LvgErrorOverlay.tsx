import React from "react";
import LvgIcon from "./LvgIcon";
import LvgModalShell from "./LvgModalShell";

type LvgErrorOverlayProps = {
  visible?: boolean;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onClose?: () => void;
  actionLabel?: string;
  details?: string;
  variant?: "page" | "inline" | "modal";
};

export default function LvgErrorOverlay({
  visible = true,
  title = "Qualcosa e andato storto.",
  message = "Non siamo riusciti ad aggiornare il banco. Riprova tra qualche secondo.",
  onRetry,
  onClose,
  actionLabel = "Riprova",
  details,
  variant = "page",
}: LvgErrorOverlayProps) {
  if (!visible) return null;

  const content = (
    <div className={`lvg-error lvg-error--${variant}`} role="alert">
      <div className="lvg-error__card">
        <span className="lvg-error__icon" aria-hidden="true">
          <LvgIcon name="alert" />
        </span>
        <div>
          <h2>{title}</h2>
          <p>{message}</p>
          {details && process.env.NODE_ENV === "development" && (
            <pre>{details}</pre>
          )}
        </div>
        <div className="lvg-error__actions">
          {onRetry && (
            <button className="lvg-cta lvg-cta--primary" type="button" onClick={onRetry}>
              <LvgIcon name="refresh" />
              {actionLabel}
            </button>
          )}
          {onClose && (
            <button className="lvg-cta lvg-cta--secondary" type="button" onClick={onClose}>
              Chiudi
            </button>
          )}
        </div>
      </div>
    </div>
  );

  if (variant === "modal") {
    return (
      <LvgModalShell size="small" tone="dark" onClose={onClose}>
        {content}
      </LvgModalShell>
    );
  }

  return content;
}
