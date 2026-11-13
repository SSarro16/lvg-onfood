import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { action as logoutAction } from "../pages/LogOut";
import { AuthContext } from "../store/context/auth-context";
import { useToast } from "../store/context/toaster-context";
import { useLang } from "../store/context/lang-context";
import lvglogo from "../assets/lvglogo.png";

export default function Items() {
  const { showToast } = useToast();
  const { currentUser, signOut, getToken } = useContext(AuthContext);
  const [token, setToken] = useState<string | undefined>();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t: translate, lang, setLang } = useLang();
  const activeLang = lang === "en" ? "EN" : "IT";

  useEffect(() => {
    const handleToken = async () => {
      const token = await getToken();
      setToken(token);
    };
    handleToken();
  }, [currentUser, getToken]);

  const goTo = (path: string) => {
    navigate(path);
    setMobileOpen(false);
    setLanguageOpen(false);
  };

  const changeLanguage = (nextLang: string) => {
    setLang(nextLang);
    setLanguageOpen(false);
  };

  const logoutHandler = () => {
    try {
      if (token !== undefined) {
        logoutAction(token, navigate, signOut);
        setMobileOpen(false);
        showToast({
          severity: "success",
          summary: "Logged out",
          detail: "Logged out successfully",
        });
      }
    } catch (error) {
      showToast({
        severity: "warn",
        summary: "Error",
        detail: `An error occured while logging out: ${error}`,
      });
    }
  };

  const nav = (
    <>
      <button
        className={`lvg-nav__item ${location.pathname === "/" ? "lvg-nav__item--active" : ""}`}
        onClick={() => goTo("/")}
      >
        Home
      </button>
      <button
        className={`lvg-nav__item ${location.pathname === "/menu-live" ? "lvg-nav__item--active" : ""}`}
        onClick={() => goTo("/menu-live")}
      >
        Menu live
      </button>
      {token && (
        <button className="lvg-nav__item" onClick={() => goTo("/newproduct")}>
          Admin
        </button>
      )}
      <button
        className={`lvg-nav__item ${location.pathname === "/contatti" ? "lvg-nav__item--active" : ""}`}
        onClick={() => goTo("/contatti")}
      >
        Contatti
      </button>
    </>
  );

  return (
    <header className="lvg-header">
      <div className="lvg-brand">
        <span className="lvg-brand__mark" aria-hidden="true">
          <img src={lvglogo} alt="" />
        </span>
        <span>
          <span className="lvg-brand__kicker">Lo Verde Gastronomy</span>
          <strong>LVG OnFood</strong>
        </span>
      </div>

      <nav className="lvg-nav" aria-label="Navigazione principale">
        {nav}
      </nav>

      <div className="lvg-header__actions">
        <div className="lvg-language">
          <button
            className="lvg-language__trigger"
            type="button"
            aria-label={translate("translate")}
            aria-expanded={languageOpen}
            aria-haspopup="menu"
            onClick={() => setLanguageOpen((open) => !open)}
          >
            <i className="pi pi-globe" aria-hidden="true" />
            <span>{activeLang}</span>
          </button>
          {languageOpen && (
            <div className="lvg-language__menu" role="menu">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={lang === "it"}
                onClick={() => changeLanguage("it")}
              >
                <span className="fi fi-it" aria-hidden="true" />
                Italiano
                <strong>IT</strong>
              </button>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={lang === "en"}
                onClick={() => changeLanguage("en")}
              >
                <span className="fi fi-gb" aria-hidden="true" />
                English
                <strong>EN</strong>
              </button>
            </div>
          )}
        </div>
        {!token && (
          <button className="lvg-login-button" type="button" onClick={() => goTo("/login")}>
            <i className="pi pi-user" aria-hidden="true" />
            Login
          </button>
        )}
        {token && (
          <button className="lvg-login-button" type="button" onClick={logoutHandler}>
            <i className="pi pi-user" aria-hidden="true" />
            Log Out
          </button>
        )}
        <button
          className="lvg-mobile-menu-button"
          type="button"
          aria-label="Apri menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <i className="pi pi-bars" aria-hidden="true" />
        </button>
      </div>

      {mobileOpen && (
        <nav className="lvg-mobile-nav" aria-label="Navigazione mobile">
          {nav}
          <div className="lvg-mobile-nav__tools">
            <button
              type="button"
              className="lvg-mobile-tool"
              aria-pressed={lang === "it"}
              onClick={() => changeLanguage("it")}
            >
              <span className="fi fi-it" aria-hidden="true" />
              Italiano
            </button>
            <button
              type="button"
              className="lvg-mobile-tool"
              aria-pressed={lang === "en"}
              onClick={() => changeLanguage("en")}
            >
              <span className="fi fi-gb" aria-hidden="true" />
              English
            </button>
          </div>
          {!token && (
            <button className="lvg-login-button lvg-login-button--mobile" type="button" onClick={() => goTo("/login")}>
              <i className="pi pi-user" aria-hidden="true" />
              Login
            </button>
          )}
          {token && (
            <button className="lvg-login-button lvg-login-button--mobile" type="button" onClick={logoutHandler}>
              <i className="pi pi-user" aria-hidden="true" />
              Log Out
            </button>
          )}
          {token && <span className="lvg-mobile-user">{translate("logged_user")}{currentUser?.email}</span>}
        </nav>
      )}
    </header>
  );
}
