import React from "react";
import { NavLink, useRouteLoaderData, Form } from "react-router-dom";
import classes from "./MainNavigator.module.css";
import { MegaMenu } from "primereact/megamenu";
import { start } from "repl";

const MainNavigator = () => {
  const token = useRouteLoaderData("root");

  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
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
          {!token ? (
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
          ) : (
            <>
              <li>
                <NavLink
                  to="/newproduct"
                  className={({ isActive }) =>
                    isActive ? classes.active : undefined
                  }
                >
                  New Product
                </NavLink>
              </li>
              <li>
                <Form action="/logout" method="POST">
                  <button>Log Out</button>
                </Form>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigator;
