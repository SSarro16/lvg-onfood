import React, { useContext, useEffect, useState } from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import { MenuItem } from "primereact/menuitem";
import { action as logoutAction } from "../pages/LogOut";
import { AuthContext } from "../components/Firebase/context/auth-context";

export default function Items() {
  const { currentUser, signOut, getToken } = useContext(AuthContext);
  const [token, setToken] = useState<string | undefined>();
  const navigate = useNavigate();

  useEffect(() => {
    const handleToken = async () => {
      setToken(await getToken());
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
      <Menubar model={items} />
    </div>
  );
}
