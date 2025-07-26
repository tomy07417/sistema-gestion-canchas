import React from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { CanchaRequestSchema } from "@/models/Cancha";
import { useCrearCancha, usePoblarFranjas, useCanchas, useEliminarCancha } from "@/services/CanchaService";
import { useLocation } from "wouter";
import ToggleSwitch from "../components/form-components/Switch/ToggleSwitch.tsx";
import styles from "../styles/CanchasScreen.module.css";
import type { Cancha } from "@/models/Cancha";

type TipoCesped = "Sintetico" | "Natural";
interface FormValues {
  nombre: string;
  tipoCesped: TipoCesped;
  iluminacion: boolean;
  zona: string;
  direccion: string;
  desde: string;
  hasta: string;
  horaInicio: string;
  horaFin: string;
  duracionMinutos: number;
}

type FranjaForm = {
  fechaInicial: string;
  fechaFinal: string;
  horarioInicio: string;
  horarioFin: string;
  minutos: number;
};

interface ModalAgregarFranjaProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (form: FranjaForm) => Promise<void>;
  loading: boolean;
  initialValues: FranjaForm;
  canchaNombre: string;
}

function hasMessage(obj: unknown): obj is { message: string } {
  return (
      !!obj &&
      typeof obj === "object" &&
      "message" in obj &&
      typeof (obj as { message: unknown }).message === "string"
  );
}

function renderFieldErrors(errors: unknown) {
  if (!errors) return null;
  if (Array.isArray(errors)) {
    return errors.map((err, idx) =>
        typeof err === "string"
            ? <div key={idx}>{err}</div>
            : hasMessage(err)
                ? <div key={idx}>{err.message}</div>
                : null
    );
  }
  if (typeof errors === "string") return <div>{errors}</div>;
  return null;
}

function ModalAgregarFranja({
                              open,
                              onClose,
                              onSubmit,
                              loading,
                              initialValues,
                              canchaNombre,
                            }: ModalAgregarFranjaProps) {
  const [form, setForm] = React.useState<FranjaForm>(initialValues);

  React.useEffect(() => {
    setForm(initialValues);
  }, [initialValues, open]);

  if (!open) return null;

  return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalBox}>
          <h2>Agregar franjas a "{canchaNombre}"</h2>
          <div className={styles.franjasGrid}>
            <input
                type="date"
                placeholder="Desde"
                value={form.fechaInicial}
                onChange={e => setForm(f => ({ ...f, fechaInicial: e.target.value }))}
                className={styles.input}
            />
            <input
                type="date"
                placeholder="Hasta"
                value={form.fechaFinal}
                min={form.fechaInicial}
                onChange={e => setForm(f => ({ ...f, fechaFinal: e.target.value }))}
                className={styles.input}
            />
            <input
                type="time"
                placeholder="Hora inicio"
                value={form.horarioInicio}
                onChange={e => setForm(f => ({ ...f, horarioInicio: e.target.value }))}
                className={styles.input}
            />
            <input
                type="time"
                placeholder="Hora fin"
                value={form.horarioFin}
                onChange={e => setForm(f => ({ ...f, horarioFin: e.target.value }))}
                className={styles.input}
            />
            <input
                type="number"
                placeholder="Duración (minutos)"
                min={15}
                step={15}
                value={form.minutos}
                onChange={e => setForm(f => ({ ...f, minutos: Number(e.target.value) }))}
                className={styles.input}
            />
          </div>
          <div className={styles.buttonRow}>
            <button
                className={styles.submitButton}
                onClick={async () => {
                  await onSubmit(form);
                  onClose();
                }}
                disabled={loading}
            >
              {loading ? "Guardando..." : "Agregar franjas"}
            </button>
            <button
                className={styles.deleteButton}
                onClick={onClose}
                disabled={loading}
                style={{ marginLeft: 12 }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
  );
}

export const CanchaScreen: React.FC = () => {
  const [, navigate] = useLocation();
  const { data: canchas, isLoading, isError, refetch } = useCanchas();
  const eliminarCancha = useEliminarCancha({
    onSuccess: () => {
      alert("Cancha eliminada correctamente");
      refetch();
    },
    onError: (error: unknown) => {
      if (error && typeof error === "object" && "message" in error) {
        alert("Error al eliminar cancha: " + (error as { message: string }).message);
      } else {
        alert("Error al eliminar cancha");
      }
    },
  });

  const { mutateAsync, error } = useCrearCancha();
  const poblarFranjas = usePoblarFranjas();
  const [loadingFranjas, setLoadingFranjas] = React.useState(false);

  const [modalFranja, setModalFranja] = React.useState<{ id: number, nombre: string } | null>(null);

  const [formFranja, setFormFranja] = React.useState<FranjaForm>({
    fechaInicial: "",
    fechaFinal: "",
    horarioInicio: "",
    horarioFin: "",
    minutos: 60,
  });

  const [loadingModalFranja, setLoadingModalFranja] = React.useState<boolean>(false);

  const formData = useAppForm({
    defaultValues: {
      nombre: "",
      tipoCesped: "Sintetico",
      iluminacion: false,
      zona: "",
      direccion: "",
      desde: "",
      hasta: "",
      horaInicio: "",
      horaFin: "",
      duracionMinutos: 60,
    },
    validators: {
      onChange: CanchaRequestSchema,
    },
    onSubmit: async ({ value }: { value: FormValues }) => {
      if (value.desde && value.hasta && value.hasta < value.desde) {
        alert("La fecha 'Hasta' no puede ser menor que 'Desde'");
        return;
      }
      try {
        const cancha = await mutateAsync({
          nombre: value.nombre,
          tipoCesped: value.tipoCesped,
          iluminacion: value.iluminacion,
          zona: value.zona,
          direccion: value.direccion,
        });

        if (
            cancha?.id &&
            value.desde &&
            value.hasta &&
            value.horaInicio &&
            value.horaFin &&
            value.duracionMinutos
        ) {
          setLoadingFranjas(true);
          await poblarFranjas.mutateAsync({
            canchaId: cancha.id,
            fechaInicial: value.desde,
            fechaFinal: value.hasta,
            horarioInicio: value.horaInicio,
            horarioFin: value.horaFin,
            minutos: value.duracionMinutos,
          });
          setLoadingFranjas(false);
        }

        alert("Cancha creada con éxito y franjas generadas!");

        formData.reset();

        if (refetch) await refetch();

      } catch (e: unknown) {
        setLoadingFranjas(false);
        alert("Error: " + (e instanceof Error ? e.message : String(e)));
      }
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("¿Seguro que querés eliminar la cancha?")) {
      eliminarCancha.mutate(id);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/canchas/${id}`);
  };

  const handleAgregarFranja = (id: number, nombre: string) => {
    setModalFranja({ id, nombre });
    setFormFranja({
      fechaInicial: "",
      fechaFinal: "",
      horarioInicio: "",
      horarioFin: "",
      minutos: 60,
    });
  };

  const handleSubmitFranja = async (form: FranjaForm) => {
    if (!modalFranja) return;
    try {
      setLoadingModalFranja(true);
      await poblarFranjas.mutateAsync({
        canchaId: modalFranja.id,
        fechaInicial: form.fechaInicial,
        fechaFinal: form.fechaFinal,
        horarioInicio: form.horarioInicio,
        horarioFin: form.horarioFin,
        minutos: form.minutos,
      });
      setLoadingModalFranja(false);
      alert("Franjas agregadas con éxito a " + modalFranja.nombre + "!");
      setModalFranja(null);
      if (refetch) await refetch();
    } catch (e) {
      setLoadingModalFranja(false);
      if (hasMessage(e)) {
        alert("Error: " + e.message);
      } else {
        alert("Error: " + String(e));
      }
      setModalFranja(null);
    }

  };

  return (
      <CommonLayout>
        <div className={styles.wrapper}>
          <h1 className={styles.title}>Mis Canchas</h1>
          {isLoading && <p>Cargando canchas...</p>}
          {isError && <p>Error al cargar las canchas</p>}
          {!isLoading && !isError && canchas && (
              <div className={styles.canchasGrid}>
                {(canchas as Cancha[]).map((cancha) => (
                    <div key={cancha.id} className={`${styles.canchaCard} ${styles.canchaCardHorizontal}`}>
                      <div className={styles.canchaInfo}>
                        <strong> {cancha.nombre}</strong>
                        <span>  |  Dirección: {cancha.direccion}</span>
                        <span>  |  Césped: {cancha.tipoCesped}</span>
                        <span>  |  Zona: {cancha.zona}</span>
                        <span>  |  Iluminación: {cancha.iluminacion ? "Sí" : "No"}</span>
                        <span>  |  Estado: {cancha.activa ? "Activa" : "Inactiva"}</span>
                      </div>
                      <div className={styles.buttonRow}>
                        <button
                            className={`${styles.button} ${styles.editButton}`}
                            onClick={() => handleEdit(cancha.id)}
                        >
                          Editar
                        </button>
                        <button
                            className={`${styles.button} ${styles.deleteButton}`}
                            onClick={() => handleDelete(cancha.id)}
                            disabled={eliminarCancha.isPending}
                        >
                          {eliminarCancha.isPending ? "Eliminando..." : "Eliminar"}
                        </button>
                        <button
                            className={`${styles.button} ${styles.agregarButton}`}
                            onClick={() => handleAgregarFranja(cancha.id, cancha.nombre)}
                        >
                          Agregar franja horaria
                        </button>
                      </div>
                    </div>
                ))}
              </div>
          )}
          <div className={styles.formBox}>
            <h1 className={styles.title}>Registrar cancha</h1>
            <p className={styles.subtitle}>
              Completá los datos de la cancha y generá las franjas horarias.
            </p>
            <formData.AppForm>
              <formData.FormContainer extraError={error instanceof Error ? error : null}>
                <h2 className={styles.sectionTitle}>Datos de la cancha</h2>
                <div className={styles.fieldsGrid}>
                  <div className={styles.inputGroup}>
                    <formData.AppField name="nombre">
                      {(field) => (
                          <>
                            <field.TextField label="Nombre" />
                          </>
                      )}
                    </formData.AppField>
                  </div>
                  <div className={styles.inputGroup}>
                    <formData.AppField name="zona">
                      {(field) => (
                          <>
                            <field.TextField label="Zona" />
                          </>
                      )}
                    </formData.AppField>
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Tipo de Césped</label>
                    <formData.AppField name="tipoCesped">
                      {(field) => (
                          <>
                            <select
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value as TipoCesped)}
                                className={styles.input}
                            >
                              <option value="Sintetico">Sintético</option>
                              <option value="Natural">Natural</option>
                            </select>
                            <div className={styles.inputError}>
                              {renderFieldErrors(field.state.meta?.errors)}
                            </div>
                          </>
                      )}
                    </formData.AppField>
                  </div>
                  <div className={styles.inputGroup}>
                    <formData.AppField name="direccion">
                      {(field) => (
                          <>
                            <field.TextField label="Dirección" />
                          </>
                      )}
                    </formData.AppField>
                  </div>
                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <formData.AppField name="iluminacion">
                      {(field) => (
                          <>
                            <ToggleSwitch
                                checked={!!field.state.value}
                                onChange={field.handleChange}
                                label="Iluminación"
                                className={styles.input}
                            />
                            <div className={styles.inputError}>
                              {renderFieldErrors(field.state.meta?.errors)}
                            </div>
                          </>
                      )}
                    </formData.AppField>
                  </div>
                </div>
                <div className={styles.sectionDivider}></div>
                <h2 className={styles.sectionTitle}>Franjas horarias</h2>
                <div className={styles.franjasGrid}>
                  <formData.AppField name="desde">
                    {(field) => (
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Desde (fecha)</label>
                          <input
                              type="date"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.input}
                          />
                          <div className={styles.inputError}>
                            {renderFieldErrors(field.state.meta?.errors)}
                          </div>
                        </div>
                    )}
                  </formData.AppField>
                  <formData.AppField name="hasta">
                    {(field) => (
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Hasta (fecha)</label>
                          <input
                              type="date"
                              value={field.state.value}
                              min={formData.state.values.desde}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.input}
                          />
                          <div className={styles.inputError}>
                            {renderFieldErrors(field.state.meta?.errors)}
                          </div>
                        </div>
                    )}
                  </formData.AppField>
                  <formData.AppField name="horaInicio">
                    {(field) => (
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Hora inicio</label>
                          <input
                              type="time"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.input}
                          />
                          <div className={styles.inputError}>
                            {renderFieldErrors(field.state.meta?.errors)}
                          </div>
                        </div>
                    )}
                  </formData.AppField>
                  <formData.AppField name="horaFin">
                    {(field) => (
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Hora fin</label>
                          <input
                              type="time"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                              className={styles.input}
                          />
                          <div className={styles.inputError}>
                            {renderFieldErrors(field.state.meta?.errors)}
                          </div>
                        </div>
                    )}
                  </formData.AppField>
                  <formData.AppField name="duracionMinutos">
                    {(field) => (
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Duración (minutos)</label>
                          <input
                              type="number"
                              min={15}
                              step={15}
                              value={field.state.value}
                              onChange={(e) => field.handleChange(Number(e.target.value))}
                              className={styles.input}
                          />
                          <div className={styles.inputError}>
                            {renderFieldErrors(field.state.meta?.errors)}
                          </div>
                        </div>
                    )}
                  </formData.AppField>
                </div>
                {loadingFranjas && (
                    <div className={styles.loader}>
                      <span className={styles.spinner}></span>
                      <span>Generando franjas horarias...</span>
                    </div>
                )}
                <div className={styles.buttonRow}>
                  <formData.SubmitButton className={styles.submitButton}>
                    Registrar cancha
                  </formData.SubmitButton>
                </div>
              </formData.FormContainer>
            </formData.AppForm>
          </div>
          <ModalAgregarFranja
              open={!!modalFranja}
              onClose={() => setModalFranja(null)}
              onSubmit={handleSubmitFranja}
              loading={loadingModalFranja}
              initialValues={formFranja}
              canchaNombre={modalFranja?.nombre || ""}
          />
        </div>
      </CommonLayout>
  );
};

export default CanchaScreen;
