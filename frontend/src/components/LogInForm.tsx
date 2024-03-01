import React from "react";
import { Form, Link, useActionData, useNavigation } from "react-router-dom";
import classes from "../pages/LogIn.module.css";

export default function LogInForm() {
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const data = useActionData()
    console.log('data is: ' , data)

  return (
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
        <Link to="/">Torna alla Home</Link>
        <button disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Log In"}
        </button>
      </div>
    </Form>
  );
}
