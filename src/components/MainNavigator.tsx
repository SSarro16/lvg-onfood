import React from "react";
import { NavLink } from "react-router-dom";
import classes from "./MainNavigator.module.css";

function MainNavigator() {
  return (
    <header className={classes.header}>
      <nav>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Log In
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigator;
