import React from "react";
import { createPortal } from "react-dom";
import LvgIcon from "./LvgIcon";

type LvgModalShellProps = {
  children: React.ReactNode;
  onClose?: () => void;
  size?: "small" | "medium" | "large";
  tone?: "cream" | "dark";
  labelledBy?: string;
};

export default function LvgModalShell({
  children,
  onClose,
  size = "large",
  tone = "cream",
  labelledBy,
}: LvgModalShellProps) {
  const modal = (
    <div
      className={`lvg-modal-backdrop lvg-modal-backdrop--${tone}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`lvg-modal-shell lvg-modal-shell--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(event) => event.stopPropagation()}
      >
        {onClose && (
          <button
            className="lvg-modal-close"
            type="button"
            onClick={onClose}
            aria-label="Chiudi overlay"
          >
            <LvgIcon name="x" />
          </button>
        )}
        {children}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
