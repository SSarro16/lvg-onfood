import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  createContext,
  ReactNode,
} from "react";
import { useToast } from "./toaster-context";

// Interfaccia per rappresentare la struttura delle traduzioni
// Ogni chiave è una stringa (es: "hello"), e il valore è la traduzione (es: "Ciao")
interface Translations {
  [key: string]: string;
}

// Tipo per il valore fornito dal contesto
// Descrive ciò che sarà disponibile nei componenti che usano il context
interface LangContextType {
  lang: string; // lingua corrente (es: "en", "it")
  setLang: React.Dispatch<React.SetStateAction<string>>; // funzione per cambiare lingua
  t: (key: string) => string; // funzione per ottenere la traduzione corrispondente a una chiave
}

// Tipo per le props accettate dal LangProvider
// In questo caso, solo `children`, ovvero i componenti figli avvolti dal provider
interface LangProviderProps {
  children: ReactNode;
}

// Creazione del contesto, inizialmente undefined
// Usiamo `LangContextType | undefined` per forzare il controllo nel custom hook
const LangContext = createContext<LangContextType | undefined>(undefined);

// Componente Provider che gestisce stato lingua e caricamento traduzioni
export default function LangProvider({ children }: LangProviderProps) {
  const [lang, setLang] = useState<string>(
    () => localStorage.getItem("lang") || "it"
  );
  const [translations, setTranslations] = useState<Translations>({});
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        let module: { translations: Translations };

        switch (lang) {
          case "it":
            module = await import("../../lang/it/translations");
            break;
          case "en":
          default:
            module = await import("../../lang/en/translations");
            break;
        }

        setTranslations(module.translations);
      } catch (error) {
        showToast({
          severity: "error",
          summary: "Error",
          detail: "Failed to load translations",
          life: 3000,
        });
        setTranslations({});
      }
    };

    loadTranslations();
  }, [lang]);

  const t = useCallback(
    (key: string): string => translations[key] || key,
    [translations]
  );

  // Assegniamo il valore del contesto usando l'interfaccia LangContextType
  const value: LangContextType = { lang, setLang, t };

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

// Hook personalizzato per usare il contesto della lingua
// Il tipo di ritorno è LangContextType, come definito nell'interfaccia
export function useLang(): LangContextType {
  const { showToast } = useToast();
  const context = useContext(LangContext);
  if (!context) {
    showToast({
      severity: "warn",
      summary: "Warning",
      detail: "useLang must be used within a LangProvider",
      life: 3000,
    });
    throw new Error("useLang must be used within a LangProvider");
  }
  return context;
}
