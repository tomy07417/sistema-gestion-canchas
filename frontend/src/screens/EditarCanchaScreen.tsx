import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useCanchas, useEditarCancha } from "@/services/CanchaService";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import type { Cancha, CanchaEditRequest } from "@/models/Cancha";
import styles from "../styles/CanchasScreen.module.css";

const EditarCanchaScreen: React.FC = () => {
    const params = useParams();
    const id = Number(params.id);
    const { data: canchas } = useCanchas();
    const cancha: Cancha | undefined = (canchas as Cancha[] | undefined)?.find((c) => c.id === id);

    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [tipoCesped, setTipoCesped] = useState<"Sintetico" | "Natural">("Sintetico");
    const [iluminacion, setIluminacion] = useState(false);
    const [zona, setZona] = useState("");
    const [activa, setActiva] = useState(true);

    const [, navigate] = useLocation();

    useEffect(() => {
        if (cancha) {
            setNombre(cancha.nombre ?? "");
            setDireccion(cancha.direccion ?? "");
            setTipoCesped((cancha.tipoCesped as "Sintetico" | "Natural") ?? "Sintetico");
            setIluminacion(cancha.iluminacion);
            setZona(cancha.zona ?? "");
            setActiva(cancha.activa ?? true);
        }
    }, [cancha]);

    const editarCancha = useEditarCancha({
        onSuccess: () => {
            alert("Cancha editada correctamente");
            navigate("/crear-cancha");
        },
        onError: (error: unknown) => {
            if (error && typeof error === "object" && "message" in error) {
                alert("Error al editar cancha: " + (error as { message: string }).message);
            } else {
                alert("Error al editar cancha");
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editarCancha.mutate({
            id,
            data: { nombre, direccion, tipoCesped, iluminacion, zona, activa } as CanchaEditRequest,
        });
    };

    if (!cancha) return (
        <CommonLayout>
            <div className={styles.wrapper}>
                <div className={styles.formBox}>
                    <div style={{textAlign: "center", fontWeight:700, fontSize:"1.2rem"}}>Cargando datos de la cancha...</div>
                </div>
            </div>
        </CommonLayout>
    );

    return (
        <CommonLayout>
            <div className={styles.wrapper}>
                <div className={styles.formBox} style={{ maxWidth: 420 }}>
                    <h1 className={styles.title} style={{ fontSize: "2rem" }}>Editar Cancha</h1>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Nombre</label>
                            <input
                                className={styles.input}
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Dirección</label>
                            <input
                                className={styles.input}
                                value={direccion}
                                onChange={e => setDireccion(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Tipo Césped</label>
                            <select
                                className={styles.input}
                                value={tipoCesped}
                                onChange={e => setTipoCesped(e.target.value as "Sintetico" | "Natural")}
                                required
                            >
                                <option value="Sintetico">Sintético</option>
                                <option value="Natural">Natural</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup} style={{ flexDirection: "row", alignItems: "center", gap: "8px" }}>
                            <label className={styles.label} style={{ marginBottom: 0 }}>Iluminación</label>
                            <input
                                type="checkbox"
                                checked={iluminacion}
                                style={{ width: 18, height: 18 }}
                                onChange={e => setIluminacion(e.target.checked)}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Zona</label>
                            <input
                                className={styles.input}
                                value={zona}
                                onChange={e => setZona(e.target.value)}
                            />
                        </div>
                        <div className={styles.inputGroup} style={{ flexDirection: "row", alignItems: "center", gap: "8px", marginTop: "-8px" }}>
                            <label className={styles.label} style={{ marginBottom: 0 }}>Activa</label>
                            <input
                                type="checkbox"
                                checked={activa}
                                style={{ width: 18, height: 18 }}
                                onChange={e => setActiva(e.target.checked)}
                            />
                        </div>
                        <div className={styles.buttonRow}>
                            <button
                                className={styles.submitButton}
                                type="submit"
                                style={{ minWidth: 160 }}
                                disabled={editarCancha.isPending}
                            >
                                {editarCancha.isPending ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </CommonLayout>
    );
};

export default EditarCanchaScreen;
