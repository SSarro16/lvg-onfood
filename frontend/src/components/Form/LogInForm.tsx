import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import { signInUser } from "../../vendors/firebase";
import { Form, NavLink, useNavigate, useNavigation } from "react-router-dom";
import classes from "./Form.module.css";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useToast } from "../../store/context/toaster-context";

type FormFields = {
  email: string;
  password: string;
};

const defaultFormFields = {
  email: "",
  password: "",
};

export default function LogInForm() {
  const { showToast } = useToast();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [isError, setIsError] = useState(false);
  const [formFields, setFormFields] = useState<FormFields>(defaultFormFields);
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
        resetFormFields();
        navigate("/");
        showToast({
          severity: "success",
          summary: "Logged in",
          detail: "Logged in successfully",
          life: 3000,
        });
      } else {
        // Handle Errors (Toasts)
        setIsError(true);
        showToast({
          severity: "error",
          summary: "Error",
          detail: "Invalid email or password",
          life: 3000,
        });
      }
    } catch (error: any) {
      // Handle Errors (Toasts)
      setIsError(true);
      showToast({
        severity: "error",
        summary: "Error",
        detail: "Invalid email or password",
        life: 3000,
      });
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setIsError(false);
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <>
      <Form method="post" className={classes.form} onSubmit={handleSubmit}>
        <div className="card flex flex-columns md:flex-row gap-3">
          <div className="p-inputgroup flex-1">
            <span className="p-float-label">
              <InputText
                className={isError ? "p-invalid" : ""}
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
                className={isError ? "p-invalid" : ""}
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
          
          <Button id="recaptcha" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Log In"}
          </Button>
        </div>
      </Form>
    </>
  );
}
