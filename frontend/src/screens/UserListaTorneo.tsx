import React, { useState } from "react";
import { useGetTorneosDisponibles, useInscribirEquipo } from "@/services/TorneoService";
import { useGetMisEquipos } from "@/services/EquipoService";
import type { TorneoDisponible } from "@/models/Torneo";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import styles from "../styles/UserListaTorneo.module.css";

type EstadoTorneo = 'ABIERTO' | 'EN_CURSO' | 'FINALIZADO' | '';

export const UserListaTorneo: React.FC = () => {
    const { data: equipos } = useGetMisEquipos();
    const [equipoSeleccionado, setEquipoSeleccionado] = useState<string>("");
    const { mutate: inscribirEquipo } = useInscribirEquipo();

    const { data: torneos, isLoading, error } = useGetTorneosDisponibles();
    const [filtros, setFiltros] = useState<{ estado: EstadoTorneo; nombre: string }>({ estado: '', nombre: '' });
    const [modalTorneo, setModalTorneo] = useState<TorneoDisponible | null>(null);

    const torneosFiltrados = (torneos || []).filter((t) =>
        (!filtros.estado || t.estado === filtros.estado) &&
        t.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())
    );

    const formatearEstado = (estado: EstadoTorneo): string => {
        switch (estado) {
            case "ABIERTO": return "Abierto para inscripción";
            case "EN_CURSO": return "En curso";
            case "FINALIZADO": return "Finalizado";
            default: return estado;
        }
    };

    const formatoFecha = (fecha: string): string =>
        new Date(fecha).toLocaleDateString("es-AR");

    const estadoClass = (estado: EstadoTorneo) => {
        if (estado === "ABIERTO") return styles.estadoAbierto;
        if (estado === "EN_CURSO") return styles.estadoEnCurso;
        if (estado === "FINALIZADO") return styles.estadoFinalizado;
        return "";
    };

return (
  <CommonLayout>
    <div className={styles.pageWrapper}>
      <div className={styles.titleRow}>
        <span className={styles.trophyIcon}>🏆</span>
        <span className={styles.title}>Torneos Disponibles</span>
      </div>

      <div className={styles.filtersBox}>
        <input
          type="text"
          placeholder="Buscar por nombre"
          className={styles.searchInput}
          value={filtros.nombre}
          onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
        />
        <select
          className={styles.estadoSelect}
          value={filtros.estado}
          onChange={(e) =>
            setFiltros({ ...filtros, estado: e.target.value as EstadoTorneo })
          }
        >
          <option value="">Todos los estados</option>
          <option value="ABIERTO">Abierto para inscripción</option>
          <option value="EN_CURSO">En curso</option>
          <option value="FINALIZADO">Finalizado</option>
        </select>
      </div>

      {isLoading && <p>Cargando torneos…</p>}
      {error && <p style={{ color: "#d34444", marginTop: 16 }}>Error al cargar torneos.</p>}

      {!isLoading && torneosFiltrados.length === 0 ? (
        <p style={{ color: "#768097", margin: "30px 0" }}>
          No hay torneos disponibles con los filtros aplicados.
        </p>
      ) : (
        <div className={styles.gridCards}>
          {torneosFiltrados.map((torneo: TorneoDisponible) => (
            <div
              key={torneo.id}
              className={styles.torneoCard}
              onClick={() => setModalTorneo(torneo)}
            >
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>🏟️</span>
                <span className={styles.cardName}>{torneo.nombre}</span>
              </div>
              <div className={styles.cardDetail}>
                <strong>Inicio:</strong> {formatoFecha(torneo.fechaInicio)}
              </div>
              <div className={styles.cardDetail}>
                <strong>Formato:</strong> {torneo.formato}
              </div>
              <div className={`${styles.cardEstado} ${estadoClass(torneo.estado)}`}>
                {formatearEstado(torneo.estado as EstadoTorneo)}
              </div>
              <button
                className={styles.inscribirseBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setModalTorneo(torneo);
                }}
                disabled={torneo.estado !== "ABIERTO"}
                style={{
                  opacity: torneo.estado === "ABIERTO" ? 1 : 0.6,
                  cursor: torneo.estado === "ABIERTO" ? "pointer" : "not-allowed",
                }}
              >
                Inscribirse
              </button>
            </div>
          ))}
        </div>
      )}
    </div>

    {modalTorneo && (
      <div className={styles.modalBg} onClick={() => setModalTorneo(null)}>
        <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
          <h2 className={styles.modalTitle}>{modalTorneo.nombre}</h2>
          <div className={styles.modalDetail}>
            <strong>Inicio:</strong> {formatoFecha(modalTorneo.fechaInicio)}
          </div>
          <div className={styles.modalDetail}>
            <strong>Formato:</strong> {modalTorneo.formato}
          </div>
          <div className={styles.modalDetail}>
            <strong>Estado:</strong> {formatearEstado(modalTorneo.estado as EstadoTorneo)}
          </div>
          <div className={styles.modalDetail}>
            <strong>Descripción:</strong> {modalTorneo.descripcion || "Sin descripción"}
          </div>
          <div className={styles.modalDetail}>
            <strong>Premios:</strong> {modalTorneo.premios || "Sin premios"}
          </div>
          <div className={styles.modalDetail}>
            <strong>Costo:</strong> ${modalTorneo.costoInscripcion?.toFixed(2) || "0.00"}
          </div>

          {modalTorneo.estado === "ABIERTO" && (
            <>
              <div className={styles.modalDetail}>
                <strong>Seleccioná tu equipo:</strong>
                <select
                  className={styles.modalSelect}
                  value={equipoSeleccionado}
                  onChange={(e) => setEquipoSeleccionado(e.target.value)}
                >
                  <option value="">-- Elegí un equipo --</option>
                  {(equipos || []).map((eq) => (
                    <option key={eq.teamName} value={eq.teamName}>
                      {eq.teamName}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className={styles.modalBtn}
                disabled={!equipoSeleccionado}
                onClick={() => {
                  const equipo = equipos?.find((eq) => eq.teamName === equipoSeleccionado);
                  if (equipo) {
                    inscribirEquipo(
                      { equipo, nombreTorneo: modalTorneo.nombre },
                      {
                        onSuccess: () => {
                          alert("¡Equipo inscrito exitosamente!");
                          setModalTorneo(null);
                        },
                        onError: (err: any) => {
                          alert(err.message);
                        },
                      }
                    );
                  }
                }}
              >
                Confirmar inscripción
              </button>
            </>
          )}

          <div className={styles.modalBtnRow}>
            <button className={styles.modalBtn} onClick={() => setModalTorneo(null)}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )}
  </CommonLayout>
);
};
