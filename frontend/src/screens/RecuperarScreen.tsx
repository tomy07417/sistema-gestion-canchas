import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { RecuperacionRequestSchema } from "@/models/Login";
import { useCambiarContrasenia } from "@/services/UserServices";
import { useParams } from "wouter";
import styles from "../styles/LoginScreen.module.css";

export const RecuperarScreen = () => {
	const navigate = useNavigate();
	const { mutate, error } = useCambiarContrasenia();
	const { token } = useParams<{ token: string }>();
	const [successMsg, setSuccessMsg] = useState<string | null>(null);

	const formData = useAppForm({
		defaultValues: {
			newPassword: "",
		},
		validators: { onChange: RecuperacionRequestSchema },
		onSubmit: async ({ value }) => {
			if (!token) {
				alert("Token no encontrado en la URL.");
				return;
			}
			mutate(
				{ token, newPassword: value.newPassword },
				{
					onSuccess: () => {
						setSuccessMsg("¡Contraseña nueva guardada con éxito!");
					},
				}
			);
		},
	});

	const handleCloseAlert = () => {
		setSuccessMsg(null);
		navigate("/login");
	};

	return (
		<CommonLayout>
			<div className={styles.loginBox}>
				<h1 className={styles.title}>Recupera Contraseña</h1>
				<p className={styles.subtitle}>
					Complete los datos para iniciar la Recuperación.
				</p>

				{successMsg && (
					<div className={styles.overlay}>
						<div className={styles.modalBox}>
							<div className={styles.modalText}>{successMsg}</div>
							<button
								onClick={handleCloseAlert}
								className={styles.modalOkButton}
							>
								OK
							</button>
						</div>
					</div>
				)}

				<formData.AppForm>
					<formData.FormContainer extraError={error}>
						<div className={styles.inputGroup}>
							<formData.AppField name="newPassword">
								{(field) => <field.PasswordField label="Nueva Contraseña" />}
							</formData.AppField>
						</div>
						<div className={styles.buttonRow}>
							<formData.SubmitButton className={styles.submitButton}>
								Enviar
							</formData.SubmitButton>
						</div>
					</formData.FormContainer>
				</formData.AppForm>
			</div>
		</CommonLayout>
	);
};
export default RecuperarScreen;
