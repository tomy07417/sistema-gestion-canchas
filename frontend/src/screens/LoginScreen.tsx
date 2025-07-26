import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppForm } from "@/config/use-app-form";
import { LoginRequestSchema } from "@/models/Login";
import { useLogin } from "@/services/UserServices";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import styles from "../styles/LoginScreen.module.css";

export const LoginScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showInviteMsg, setShowInviteMsg] = useState(false);

  useEffect(() => {
    if (location.state?.showInviteMsg) {
      setShowInviteMsg(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const { mutate, error } = useLogin();

  const formData = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: { onChange: LoginRequestSchema },
    onSubmit: async ({ value }) => {
      mutate(value, {
        onSuccess: (resp) => {
          if (resp.wasInvited) {
            navigate("/listar-partidos-abiertos", { state: { showInviteMsg: true } });
          } else {
            navigate("/");
          }
        },
      });
    },
  });

  return (
      <CommonLayout>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>Iniciar sesión</h1>
          {showInviteMsg && (
              <div className={styles.successAlert}>
                ¡Te inscribiste exitosamente al partido al que fuiste invitado!
              </div>
          )}
          <formData.AppForm>
            <formData.FormContainer extraError={error}>
              <div className={styles.inputGroup}>
                <formData.AppField name="email">
                  {(field) => <field.TextField label="Email" />}
                </formData.AppField>
              </div>
              <div className={styles.inputGroup}>
                <formData.AppField name="password">
                  {(field) => <field.PasswordField label="Contraseña" />}
                </formData.AppField>
              </div>
              <div className={styles.buttonRow}>
                <formData.SubmitButton className={styles.submitButton}>
                  Iniciar sesión
                </formData.SubmitButton>
              </div>
            </formData.FormContainer>
          </formData.AppForm>
        </div>
      </CommonLayout>
  );
};

export default LoginScreen;
