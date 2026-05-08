import React, { useContext, useEffect, useState } from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import { MenuItem } from "primereact/menuitem";
import { action as logoutAction } from "../pages/LogOut";
import { AuthContext } from "../store/context/auth-context";
import { useToast } from "../store/context/toaster-context";
import { useLang } from "../store/context/lang-context";
import "flag-icons/css/flag-icons.min.css";
import lvglogo from "../assets/lvglogo.png";

export default function Items() {
  const { showToast } = useToast();
  const { currentUser, signOut, getToken } = useContext(AuthContext);
  const [token, setToken] = useState<string | undefined>();
  const navigate = useNavigate();
  const { t: translate, setLang } = useLang();

  useEffect(() => {
    console.log("MenuBar.Items.useEffect", { currentUser, token });
    const handleToken = async () => {
      const token = await getToken();
      console.log("MenuBar.Items.useEffect.handleToken", { token });
      setToken(token);
    };
    handleToken();
  }, [currentUser]);
  const items: MenuItem[] = [
    {
      id: "home-menuitem-bar",
      label: "Home",
      icon: "pi pi-home",
      command: () => {
        navigate("/");
      },
    },
    {
      id: "newproducts-menuitem-bar",
      label: translate('new_product'),
      icon: "pi pi-plus",
      command: () => {
        navigate("/newproduct");
      },
      visible: !!token,
    },
    {
      id: "authentication",
      label: translate('authentication'),
      icon: "pi pi-users",
      items: [
        {
          id: "login-menuitem-bar",
          label: "Log In",
          icon: "pi pi-sign-in",
          command: () => {
            navigate("/login");
          },
          visible: !token,
        },
        {
          id: "loggeduser-menuitem-bar",
          label: translate('logged_user') + currentUser?.email,
          icon: "pi pi-user",
          visible: !!token,
        },
        {
          id: "logout-menuitem-bar",
          label: "Log Out",
          icon: "pi pi-sign-out",
          command: () => {
            console.log(token);
            try {
              if (token !== undefined) {
                logoutAction(token, navigate, signOut);
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
          },
          visible: !!token,
        },
      ],
    },
    {
      id: "translate-menuitem-bar",
      label: translate("translate"),
      icon: "pi pi-language",
      items: [
        {
          id: "italiano-menuitem-bar",
          label: "Italiano",
          icon: "fi fi-it",
          command: () => {
            setLang("it");
          },
        },
        {
          id: "english-menuitem-bar",
          label: "English",
          icon: "fi fi-gb-eng",
          command: () => {
            setLang("en");
          },
        },
      ],
    },
  ];

  const start = (
    <span className="lvg-brand">
      <img src={lvglogo} alt="LVG OnFood" />
      <span>LVG OnFood</span>
    </span>
  );

  return (
    <nav className="lvg-topbar" aria-label="Navigazione principale">
      <Menubar model={items} start={start} />
    </nav>
  );
}
