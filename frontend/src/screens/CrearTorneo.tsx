import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { TorneoRequestSchema } from "@/models/Torneo";
import { useLocation } from "wouter";
import { useCrearTorneo } from "@/services/TorneoService";
import styles from "../styles/CrearTorneo.module.css";

export const CrearTorneo = () => {
  const [, navigate] = useLocation();

  const { mutate, error } = useCrearTorneo({
    onSuccess: () => {
      alert("¡Torneo creado con éxito!");
      navigate("/");
    },
  });

  const formData = useAppForm({
    defaultValues: {
      nombre: "",
      fechaInicio: "",
      formato: "ELIMINACION_DIRECTA",
      cantidadMaximaEquipos: 2,
      fechaFin: "",
      descripcion: "",
      premios: "",
      costoInscripcion: 0,
    },
    validators: {
      onChange: TorneoRequestSchema,
    },
    onSubmit: async ({ value }) => {
      mutate({
        ...value,
        formato: value.formato as "ELIMINACION_DIRECTA" | "FASE_GRUPOS_ELIMINACION" | "LIGA",
      });
    },

  });

  return (
      <CommonLayout>
        <div className={styles.pageBg}>
          <div className={styles.formWrapper}>
            <div className={styles.header}>
              <div className={styles.iconCircle}>🏆</div>
              <div>
                <h1 className={styles.title}>Crear Torneo</h1>
                <div className={styles.subtitle}>
                  Completa los datos de tu torneo.
                </div>
              </div>
            </div>
            <formData.AppForm>
              <formData.FormContainer extraError={error}>
                <div className={styles.gridSection}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Nombre del Torneo</label>
                    <formData.AppField name="nombre">
                      {(field) => (
                          <input
                              type="text"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.input}
                          />
                      )}
                    </formData.AppField>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Fecha de inicio</label>
                    <formData.AppField name="fechaInicio">
                      {(field) => (
                          <input
                              type="date"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.input}
                          />
                      )}
                    </formData.AppField>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Fecha de fin (opcional)</label>
                    <formData.AppField name="fechaFin">
                      {(field) => (
                          <input
                              type="date"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.input}
                          />
                      )}
                    </formData.AppField>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Formato del torneo</label>
                    <formData.AppField name="formato">
                      {(field) => (
                          <select
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.input}
                          >
                            <option value="ELIMINACION_DIRECTA">Eliminación Directa</option>
                            <option value="FASE_GRUPOS_ELIMINACION">Fase de Grupos y Eliminación</option>
                            <option value="LIGA">Liga</option>
                          </select>
                      )}
                    </formData.AppField>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Máximo de Equipos</label>
                    <formData.AppField name="cantidadMaximaEquipos">
                      {(field) => (
                          <input
                              type="number"
                              min={2}
                              step={1}
                              value={field.state.value}
                              onChange={(e) => field.handleChange(Number(e.target.value))}
                              className={styles.input}
                          />
                      )}
                    </formData.AppField>
                  </div>
                </div>

                <div className={styles.sectionDivider}></div>

                <div className={styles.optionalSection}>
                  <div className={styles.inputGroupFull}>
                    <label className={styles.label}>Descripción (opcional)</label>
                    <formData.AppField name="descripcion">
                      {(field) => (
                          <textarea
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.textarea}
                              rows={2}
                          />
                      )}
                    </formData.AppField>
                  </div>
                  <div className={styles.inputGroupFull}>
                    <label className={styles.label}>Premios (opcional)</label>
                    <formData.AppField name="premios">
                      {(field) => (
                          <input
                              type="text"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.input}
                          />
                      )}
                    </formData.AppField>
                  </div>
                  <div className={styles.inputGroupFull}>
                    <label className={styles.label}>Costo de Inscripción (opcional)</label>
                    <formData.AppField name="costoInscripcion">
                      {(field) => (
                          <input
                              type="number"
                              min={0}
                              step="any"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(Number(e.target.value))}
                              className={styles.input}
                          />
                      )}
                    </formData.AppField>
                  </div>
                </div>

                <div className={styles.buttonRow}>
                  <formData.SubmitButton className={styles.submitButton}>
                    Crear torneo
                  </formData.SubmitButton>
                </div>
              </formData.FormContainer>
            </formData.AppForm>

            <div className={styles.tipBox}>
              <span className={styles.tipIcon}>ℹ️</span>
              <span className={styles.tipText}>No todos los campos son obligatorios.</span>
            </div>
          </div>
        </div>
      </CommonLayout>
  );
};
