import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { EquipoRequestSchema } from "@/models/Equipo";
import { useLocation } from "wouter";
import { useCrearEquipo } from "@/services/EquipoService";
import styles from "../styles/CrearEquipo.module.css";

export const CrearEquipo = () => {
    const [, navigate] = useLocation();

    const { mutate, error } = useCrearEquipo({
        onSuccess: () => {
            alert("Equipo creado con éxito!");
            navigate("/");
        },
    });

    const formData = useAppForm({
        defaultValues: {
            teamName: "",
            category: "",
            mainColors: "",
            secondaryColors: "",
        },
        validators: {
            onChange: EquipoRequestSchema,
        },
        onSubmit: async ({ value }) => {
            mutate(value);
        },
    });

    return (
        <CommonLayout>
            <div className={styles.pageBg}>
                <div className={styles.formWrapper}>
                    <div className={styles.header}>
                        <span className={styles.iconCircle}>🛡️</span>
                        <h1 className={styles.title}>Crear Equipo</h1>
                        <div className={styles.subtitle}>
                            Completá los datos principales del equipo.
                        </div>
                    </div>

                    <formData.AppForm>
                        <formData.FormContainer extraError={error}>
                            <div className={styles.gridSection}>
                                <div className={styles.inputGroup}>
                                    <formData.AppField name="teamName">
                                        {(field) => (
                                            <field.TextField label="Nombre" />
                                        )}
                                    </formData.AppField>
                                </div>
                                <div className={styles.inputGroup}>
                                    <formData.AppField name="category">
                                        {(field) => (
                                            <field.TextField label="Categoría" />
                                        )}
                                    </formData.AppField>
                                </div>
                                <div className={styles.inputGroup}>
                                    <formData.AppField name="mainColors">
                                        {(field) => (
                                            <field.TextField label="Color Principal" />
                                        )}
                                    </formData.AppField>
                                </div>
                                <div className={styles.inputGroup}>
                                    <formData.AppField name="secondaryColors">
                                        {(field) => (
                                            <field.TextField label="Color Secundario" />
                                        )}
                                    </formData.AppField>
                                </div>
                            </div>
                            <div className={styles.buttonRow}>
                                <formData.SubmitButton className={styles.submitButton}>
                                    Crear equipo
                                </formData.SubmitButton>
                            </div>
                        </formData.FormContainer>
                    </formData.AppForm>
                </div>
            </div>
        </CommonLayout>
    );
};

export default CrearEquipo;
