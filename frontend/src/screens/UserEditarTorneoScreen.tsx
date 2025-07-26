import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useGetMisTorneos, useEditarTorneo } from "@/services/TorneoService";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { Torneo } from "@/models/Torneo.ts";
import styles from "../styles/AdminEditTorneos.module.css";

type FormatoTorneo = "ELIMINACION_DIRECTA" | "FASE_GRUPOS_ELIMINACION" | "LIGA";

const UserEditarTorneoScreen = () => {
    const { nombreTorneo } = useParams();
    const { data: torneos } = useGetMisTorneos();
    const torneo: Torneo | undefined = torneos?.find((t) => t.nombre === nombreTorneo);

    const [descripcion, setDescripcion] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [formato, setFormato] = useState<FormatoTorneo>("ELIMINACION_DIRECTA");
    const [cantidadMaximaEquipos, setMaxEquipos] = useState(2);
    const [costoInscripcion, setCostoInscripcion] = useState(0);
    const [premios, setPremios] = useState("");

    const [, navigate] = useLocation();

    useEffect(() => {
        if (torneo) {
            setDescripcion(torneo.descripcion || "");
            setFechaInicio(torneo.fechaInicio || "");
            setFechaFin(torneo.fechaFin || "");
            setFormato(
                torneo.formato && ["ELIMINACION_DIRECTA", "FASE_GRUPOS_ELIMINACION", "LIGA"].includes(torneo.formato)
                    ? (torneo.formato as FormatoTorneo)
                    : "ELIMINACION_DIRECTA"
            );
            setMaxEquipos(torneo.cantidadMaximaEquipos || 2);
            setCostoInscripcion(torneo.costoInscripcion || 0);
            setPremios(torneo.premios || "");
        }
    }, [torneo]);

    const editarTorneo = useEditarTorneo({
        onSuccess: () => {
            alert("Torneo editado correctamente");
            navigate("/mis-torneos");
        },
        onError: (error: unknown) => {
            if (error && typeof error === "object" && "message" in error) {
                alert("Error al editar torneo: " + (error as { message: string }).message);
            } else {
                alert("Error al editar torneo");
            }
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombreTorneo) {
            alert("Nombre del torneo no disponible.");
            return;
        }
        editarTorneo.mutate({
            nombre: nombreTorneo,
            data: {
                descripcion,
                fechaInicio,
                fechaFin,
                formato,
                cantidadMaximaEquipos: cantidadMaximaEquipos,
                costoInscripcion,
                premios,
            },
        });
    };

    if (!torneo) {
        return (
        <CommonLayout>
            <div className="container mt-4">
            <h1>Cargando datos del torneo...</h1>
            </div>
        </CommonLayout>
        );
    }

    return (
        <CommonLayout>
        <div className={styles.pageWrapper}>
            <h1 className={styles.title}>Editar Torneo</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>Nombre:</label>
            <input className={styles.input} value={nombreTorneo} disabled />

            <label className={styles.label}>Descripción:</label>
            <input className={styles.input} value={descripcion} disabled />

            <label className={styles.label}>Fecha de Inicio:</label>
            <input
                type="date"
                className={styles.input}
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
            />

            <label className={styles.label}>Fecha de Fin (opcional):</label>
            <input
                type="date"
                className={styles.input}
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
            />

            <label className={styles.label}>Formato:</label>
            <select
                className={styles.input}
                value={formato}
                onChange={(e) => setFormato(e.target.value as FormatoTorneo)}
            >
                <option value="ELIMINACION_DIRECTA">Eliminación Directa</option>
                <option value="FASE_GRUPOS_ELIMINACION">Fase de Grupos y Eliminación</option>
                <option value="LIGA">Liga</option>
            </select>

            <label className={styles.label}>Máximo de Equipos:</label>
            <input
                type="number"
                min={2}
                className={styles.input}
                value={cantidadMaximaEquipos}
                onChange={(e) => setMaxEquipos(Number(e.target.value))}
                required
            />

            <label className={styles.label}>Costo de Inscripción:</label>
            <input
                type="number"
                min={0}
                step={0.01}
                className={styles.input}
                value={costoInscripcion}
                disabled
            />

            <label className={styles.label}>Premios:</label>
            <input
                className={styles.input}
                value={premios}
                disabled
            />

            <button type="submit" className={styles.submitBtn}>
                Guardar Cambios
            </button>
            </form>
        </div>
        </CommonLayout>
    );
};

export default UserEditarTorneoScreen;
