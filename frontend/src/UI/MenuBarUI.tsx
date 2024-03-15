import React, { useContext, useEffect, useRef, useState } from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import { MenuItem } from "primereact/menuitem";
import { action as logoutAction } from "../pages/LogOut";
import { AuthContext } from "../store/context/auth-context";
import { Toast } from "primereact/toast";

export default function Items() {
  const toast = useRef<Toast>(null);
  const { currentUser, signOut, getToken } = useContext(AuthContext);
  const [token, setToken] = useState<string | undefined>();
  const navigate = useNavigate();

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
      label: "New Product",
      icon: "pi pi-plus",
      command: () => {
        navigate("/newproduct");
      },
      visible: !!token,
    },
    {
      id: "authentication",
      label: "Authentication",
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
          label: "Logged User: " + currentUser?.email,
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
                toast.current?.show({
                  severity: "success",
                  summary: "Logged out",
                  detail: "Logged out successfully",
                });
              }
            } catch (error: any) {
              console.log(error.message);
            }
          },
          visible: !!token,
        },
      ],
    },
  ];

  return (
    <div className="card">
      <Toast ref={toast} />
      <Menubar model={items} />
    </div>
  );
}
