import React from "react";
import { Form, Link, useNavigation } from "react-router-dom";
import Header from "../components/Header";
import classes from "./LogIn.module.css";

export default function LogInPage() {
    const navigation = useNavigation();

    const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <div>
        <Header title={"Log In"} message={"Log In Page in lavorazione..."} />
      </div>
      <div>
        <Form method="post" className={classes.form}>
          <p>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" required />
          </p>
          <p>
            <label htmlFor="image">Password</label>
            <input id="password" type="password" name="password" required />
          </p>
          <div className={classes.actions}>
          <Link to='/'>Torna alla Home</Link>
          <button disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Log In"}
          </button>
        </div>
        </Form>
      </div>
    </>
  );
}
