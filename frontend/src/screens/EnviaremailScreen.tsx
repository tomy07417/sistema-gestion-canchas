import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { RecuperacionENnvioRequestSchema } from "@/models/Login";
import { usePedirTokenRecuperacion } from "@/services/UserServices";
import styles from "../styles/LoginScreen.module.css";

export const RecuperarScreen = () => {
	const navigate = useNavigate();
	const [successMsg, setSuccessMsg] = useState<string | null>(null);

	const { mutate, error } = usePedirTokenRecuperacion();

	const formData = useAppForm({
		defaultValues: {
			email: "",
		},
		validators: { onChange: RecuperacionENnvioRequestSchema },
		onSubmit: async ({ value }) => {
			mutate(value, {
				onSuccess: (data) => {
					setSuccessMsg(
						data?.message ||
						"¡Mail para recuperación de contraseña enviado con éxito! Revisá tu correo."
					);
				},
			});
		},
	});

	const handleCloseAlert = () => {
		setSuccessMsg(null);
		navigate("/");
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
						<div className={styles.fieldsGrid}>
							<div className={styles.inputGroup}>
								<formData.AppField name="email">
									{(field) => (
										<field.TextField label="Ingrese su Email" />
									)}
								</formData.AppField>
							</div>
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
