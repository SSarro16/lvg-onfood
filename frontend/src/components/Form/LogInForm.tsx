import React, { ChangeEvent, FormEvent, useState } from "react";
import { signInUser } from "../Firebase/Firebase";
import { Form, NavLink, useNavigate, useNavigation } from "react-router-dom";
import classes from "./Form.module.css";
import { getIdToken } from "firebase/auth";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";

const defaultFormFields = {
  email: "",
  password: "",
};

export default function LogInForm() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const navigate = useNavigate();

  const resetFormFields = () => {
    return setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Send the email and password to firebase
      const userCredential = await signInUser(email, password);

      if (userCredential) {
        const token = await userCredential.user.getIdToken();
        resetFormFields();
        navigate("/");
      }
    } catch (error: any) {
      console.log("User Sign In Failed", error.message);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <Form method="post" className={classes.form} onSubmit={handleSubmit}>
      <div className="card flex flex-columns md:flex-row gap-3">
        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <InputText
              id="email"
              name="email"
              value={email}
              type="email"
              required
              onChange={handleChange}
            />
            <label htmlFor="email">Email</label>
          </span>
        </div>

        <div className="p-inputgroup flex-1">
          <span className="p-float-label">
            <Password
              id="password"
              inputId="password"
              name="password"
              value={password}
              type="password"
              onChange={handleChange}
              required
              toggleMask
            />
            <label htmlFor="password">Password</label>
          </span>
        </div>
      </div>

      <div hidden>
        <input id="token" name="token" />
      </div>
      <div className={classes.actions}>
        <NavLink to="/">Torna alla Home</NavLink>
        <button id="recaptcha" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Log In"}
        </button>
      </div>
    </Form>
  );
}
