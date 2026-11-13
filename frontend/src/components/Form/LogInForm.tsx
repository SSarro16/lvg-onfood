import React, { ChangeEvent, FormEvent, useState } from "react";
import { signInUser } from "../../vendors/firebase";
import { Form, NavLink, useNavigate } from "react-router-dom";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useToast } from "../../store/context/toaster-context";
import { useLang } from "../../store/context/lang-context";

type FormFields = {
  email: string;
  password: string;
};

const defaultFormFields = {
  email: "",
  password: "",
};

export default function LogInForm() {
  const { t: translate } = useLang();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [formFields, setFormFields] = useState<FormFields>(defaultFormFields);
  const { email, password } = formFields;
  const navigate = useNavigate();

  const resetFormFields = () => {
    return setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
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
    } catch (error: unknown) {
      setIsError(true);
      showToast({
        severity: "error",
        summary: "Error",
        detail: "Invalid email or password",
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setIsError(false);
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <Form method="post" className="lvg-form-card lvg-login-card" onSubmit={handleSubmit}>
      <div className="lvg-login-card__header">
        <span>
          <strong>LVG OnFood</strong>
          <span>Bentornato</span>
        </span>
        <i className="lvg-login-card__icon pi pi-lock" aria-hidden="true" />
      </div>
      <div className="lvg-form-grid">
        <div className="lvg-field">
          <label htmlFor="email">Email</label>
          <InputText
            className={isError ? "p-invalid" : ""}
            id="email"
            name="email"
            value={email}
            type="email"
            required
            onChange={handleChange}
            placeholder="admin@lvg.it"
          />
        </div>

        <div className="lvg-field">
          <label htmlFor="password">Password</label>
          <Password
            className={isError ? "p-invalid" : ""}
            inputId="password"
            name="password"
            value={password}
            onChange={handleChange}
            required
            toggleMask
            feedback={false}
            placeholder="Password"
          />
        </div>

        {isError && (
          <div className="lvg-error lvg-error--inline">
            <div className="lvg-error__card">
              <span className="lvg-error__icon pi pi-lock" aria-hidden="true" />
              <p>Email o password non corretti. Controlla i dati e riprova.</p>
            </div>
          </div>
        )}

        <div hidden>
          <input id="token" name="token" />
        </div>

        <div className="lvg-form-actions">
          <NavLink className="p-button p-button-outlined" to="/">
            {translate("backtohome_button")}
          </NavLink>
          <Button
            id="recaptcha"
            type="submit"
            label="Accedi alla dashboard"
            icon="pi pi-sign-in"
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </Form>
  );
}
