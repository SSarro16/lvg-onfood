import React from "react";
import { Menubar } from "primereact/menubar";
import lvglogo from "../assets/lvglogo.png";
import {
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import { MenuItem } from "primereact/menuitem";
import { action as logoutAction } from "../pages/LogOut";

export default function Items() {
  const token = useRouteLoaderData("root") as string;
  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      id: 'home-menuitem-bar',
      label: "Home",
      icon: "pi pi-home",
      command: () => {
        navigate("/");
      },
    },
    {
      id: 'login-menuitem-bar',
      label: "Log In",
      icon: "pi pi-user",
      command: () => {
        navigate("/login");
      },
      visible: !token,
    },

    {
      id: 'newproducts-menuitem-bar',
      label: "New Product",
      icon: "pi pi-plus",
      command: () => {
        navigate("/newproduct");
      },
      visible: !!token,
    },
    {
      id: 'logout-menuitem-bar',
      label: "Log Out",
      icon: "pi pi-user",
      command: () => {
        console.log(token);
        try {
          logoutAction(token, navigate);
        } catch (error: any) {
          console.log(error.message);
        }
      },
      visible: !!token,
    },
  ];

  return (
    <div className="card">
      <Menubar model={items} />
    </div>
  );
}
