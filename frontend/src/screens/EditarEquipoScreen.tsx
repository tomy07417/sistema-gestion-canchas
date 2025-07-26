import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useGetMisEquipos, useEditEquipo } from "@/services/EquipoService";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { EquipoRequest } from "@/models/Equipo.ts";
import styles from "../styles/AdminEditEquipos.module.css";

export const EditarEquipoScreen = () => {
  const { nombreEquipo } = useParams();
  const { data: equipos } = useGetMisEquipos();
  console.log(nombreEquipo);
  console.log(equipos);
  const equipo: EquipoRequest | undefined = equipos?.find((e) => e.teamName === nombreEquipo);

  const [category, setCategory] = useState("");
  const [mainColors, setMainColors] = useState("");
  const [secondaryColors, setSecondaryColors] = useState("");

  const [, navigate] = useLocation();

  useEffect(() => {
    if (equipo) {
      setCategory(equipo.category || "");
      setMainColors(equipo.mainColors || "");
      setSecondaryColors(equipo.secondaryColors || "");
    }
  }, [equipo]);

  const editarEquipo = useEditEquipo({
    onSuccess: () => {
      alert("Equipo editado correctamente");
      navigate("/mis-equipos");
    },
    onError: (error: unknown) => {
      if (error && typeof error === "object" && "message" in error) {
        alert("Error al editar equipo: " + (error as { message: string }).message);
      } else {
        alert("Error al editar equipo");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombreEquipo) {
      alert("Nombre del equipo no disponible.");
      return;
    }

  editarEquipo.mutate({
    nombre: equipo?.teamName || "",
    data: {
      teamName: equipo?.teamName,
      category,
      mainColors,
      secondaryColors,
    },
  });
  };

  if (!equipo) {
    return (
      <CommonLayout>
        <div className="container mt-4">
          <h1>Cargando datos del equipo...</h1>
        </div>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <div className={styles.pageWrapper}>
        <h1 className={styles.title}>Editar Equipo</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>Nombre del equipo:</label>
          <input className={styles.input} value={nombreEquipo} disabled />

          <label className={styles.label}>Categoría:</label>
          <input
            className={styles.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <label className={styles.label}>Color Principal:</label>
          <input
            className={styles.input}
            value={mainColors}
            onChange={(e) => setMainColors(e.target.value)}
            required
          />

          <label className={styles.label}>Color Secundario:</label>
          <input
            className={styles.input}
            value={secondaryColors}
            onChange={(e) => setSecondaryColors(e.target.value)}
            required
          />

          <button type="submit" className={styles.submitBtn}>
            Guardar Cambios
          </button>
        </form>
      </div>
    </CommonLayout>
  );
}