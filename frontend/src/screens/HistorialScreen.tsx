import { useEffect, useState } from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useObtenerHistorialPartidos } from "@/services/HistorialService";
import type { PartidoAbiertoResponseDTO, PartidoCerradoResponseDTO } from "@/models/Historial";

import styles from "../styles/HistorialScreen.module.css";

export const HistorialScreen = () => {
  const { getHistorial } = useObtenerHistorialPartidos();

  const [cerrados, setCerrados] = useState<PartidoCerradoResponseDTO[]>([]);
  const [abiertos, setAbiertos] = useState<PartidoAbiertoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getHistorial();
        setAbiertos(data.partidos_abiertos || []);
        setCerrados(data.partidos_cerrados || []);
      } catch (e) {
        alert("Error al obtener historial: " + (e instanceof Error ? e.message : e));
      } finally {
        setLoading(false);
      }
    })();
  }, [getHistorial]);

  return (
      <CommonLayout>
      <div className={styles.pageWrapper}>
        <div className={styles.titleRow}>
          <span className={styles.trophyIcon}>📋</span>
          <span className={styles.title}>Historial de Partidos</span>
        </div>

        <section className={styles.section}>
  <h2 className={styles.sectionTitle}>Partidos Cerrados</h2>
  {loading ? (
    <p className={styles.loadingText}>Cargando...</p>
  ) : cerrados.length === 0 ? (
    <p className={styles.emptyText}>No hay partidos cerrados.</p>
  ) : (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cancha</th>
            <th>Dirección</th>
            <th>Fecha</th>
            <th>Horario</th>
            <th>Equipo 1</th>
            <th>Equipo 2</th>
          </tr>
        </thead>
        <tbody>
          {cerrados.map((pc) => (
            <tr key={pc.idPartido}>
              <td>{pc.canchaNombre}</td>
              <td>{pc.canchaDireccion}</td>
              <td>{pc.fechaPartido}</td>
              <td>{pc.horaPartido}</td>
              <td>{pc.equipo1}</td>
              <td>{pc.equipo2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>

<section className={styles.section}>
  <h2 className={styles.sectionTitle}>Partidos Abiertos</h2>
  {loading ? (
    <p className={styles.loadingText}>Cargando...</p>
  ) : abiertos.length === 0 ? (
    <p className={styles.emptyText}>No hay partidos abiertos.</p>
  ) : (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cancha</th>
            <th>Dirección</th>
            <th>Fecha</th>
            <th>Horario</th>
            <th>Mínimo</th>
            <th>Máximo</th>
            <th>Jugadores</th>
          </tr>
        </thead>
        <tbody>
          {abiertos.map((pa) => (
            <tr key={pa.idPartido}>
              <td>{pa.canchaNombre}</td>
              <td>{pa.canchaDireccion}</td>
              <td>{pa.fechaPartido}</td>
              <td>{pa.horaPartido}</td>
              <td>{pa.minJugador}</td>
              <td>{pa.maxJugador}</td>
              <td>
                {pa.jugadores?.length ? (
                  <ul className={styles.jugadorList}>
                    {pa.jugadores.map(j => (
                      <li key={j.id}>{j.nombre} ({j.email})</li>
                    ))}
                  </ul>
                ) : (
                  <em className={styles.noPlayers}>Sin jugadores</em>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>
      </div>
    </CommonLayout>
  );
};
