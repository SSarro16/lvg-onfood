import React, { createContext, useContext, useRef } from "react";
import { Toast } from "primereact/toast";

interface ShowToastOptions {
  severity?: "success" | "info" | "warn" | "error";
  summary?: string;
  detail?: string;
  life?: number;
}

interface ToastContextType {
  showToast: (options: ShowToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toastRef = useRef<Toast>(null);

  const showToast = ({
    severity = "info",
    summary = "",
    detail = "",
    life = 3000,
  }: ShowToastOptions) => {
    toastRef.current?.show({ severity, summary, detail, life });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toastRef} />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
      const context = useContext(ToastContext)
      if (!context) {
            throw new Error('useToast need to be used inside <ToastProvider>')
      }
      return context
}
