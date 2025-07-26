import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { SignupSchema } from "@/models/Login";
import { useSignup } from "@/services/UserServices";
import { useToken } from "@/services/TokenContext";
import styles from "../styles/SignupScreen.module.css";

export default function SignupScreen() {
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("invite") ?? "";
  const [pendingInvite, setPendingInvite] = useState<string>(inviteToken);

  const { mutate, error } = useSignup();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [, setTokenState] = useToken();

  useEffect(() => {
    setPendingInvite(inviteToken);
  }, [inviteToken]);

  const formData = useAppForm({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
      zone: "",
      rol: "JUGADOR",
      pendingInviteToken: pendingInvite,
    },
    validators: { onChange: SignupSchema },
    onSubmit: async ({ value }) => {
      mutate(
          {
            ...value,
            pendingInviteToken: value.pendingInviteToken || undefined,
          },
          {
            onSuccess: () => {
              setTokenState({ state: "LOGGED_OUT" });
              setSuccessMsg("¡Usuario creado con éxito! Verifique su email para activar la cuenta.");
              setTimeout(() => {
                navigate("/");
              }, 2500);
            },
          }
      );
    },
  });
  return (
      <CommonLayout>
        <div className={styles.signupBox}>
          <h1 className={styles.title}>Crear cuenta</h1>
          <p className={styles.subtitle}>
            {pendingInvite
                ? "Completá los datos para registrarte y te inscribiremos automáticamente al partido."
                : "Completá los datos para registrarte."}
          </p>
          {successMsg && (
              <div className={styles.successMsg}>{successMsg}</div>
          )}
          <formData.AppForm>
            <formData.FormContainer extraError={error}>
              <div className={styles.fieldsGrid}>
                <div className={styles.inputGroup}>
                  <formData.AppField name="username">
                    {(field) => <field.TextField label="Usuario" />}
                  </formData.AppField>
                </div>
                <div className={styles.inputGroup}>
                  <formData.AppField name="password">
                    {(field) => <field.PasswordField label="Contraseña" />}
                  </formData.AppField>
                </div>
                <div className={styles.inputGroup}>
                  <formData.AppField name="email">
                    {(field) => <field.TextField label="Email" />}
                  </formData.AppField>
                </div>
                <div className={styles.inputGroup}>
                  <formData.AppField name="firstName">
                    {(field) => <field.TextField label="Nombre" />}
                  </formData.AppField>
                </div>
                <div className={styles.inputGroup}>
                  <formData.AppField name="lastName">
                    {(field) => <field.TextField label="Apellido" />}
                  </formData.AppField>
                </div>
                <div className={styles.inputGroup}>
                  <formData.AppField name="gender">
                    {(field) => <field.TextField label="Género" />}
                  </formData.AppField>
                </div>
                <div className={styles.inputGroup}>
                  <formData.AppField name="age">
                    {(field) => <field.TextField label="Edad" />}
                  </formData.AppField>
                </div>
                <div className={styles.inputGroup}>
                  <formData.AppField name="zone">
                    {(field) => <field.TextField label="Zona" />}
                  </formData.AppField>
                </div>
              </div>
              <div className={styles.inputGroup}>
                <formData.AppField name="rol">
                  {(field) => (
                      <field.SelectField label="Rol">
                        <option value="JUGADOR">Jugador</option>
                        <option value="ORGANIZADOR">Organizador</option>
                        <option value="ADMINISTRADOR">Administrador</option>
                      </field.SelectField>
                  )}
                </formData.AppField>
              </div>
              <div className={styles.buttonRow}>
                <formData.SubmitButton className={styles.submitButton}>
                  Registrarme
                </formData.SubmitButton>
              </div>
            </formData.FormContainer>
          </formData.AppForm>
        </div>
      </CommonLayout>
  );
}
