import React from "react";
import { NavLink, useRouteLoaderData, Form } from "react-router-dom";
import classes from "./MainNavigator.module.css";
import { MegaMenu } from "primereact/megamenu";
import { start } from "repl";
import Items from "../../UI/MenuBarUI";

const MainNavigator = () => {
  const token = useRouteLoaderData("root");

  return <Items />;
};

export default MainNavigator;
