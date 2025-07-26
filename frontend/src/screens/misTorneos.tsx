import { useLocation } from "wouter";
import { useGetMisTorneos, useEliminarTorneo } from "@/services/TorneoService";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { Torneo } from "@/models/Torneo";
import styles from "../styles/AdminMisTorneos.module.css";

const MisTorneos = () => {
  const [, navigate] = useLocation();
  const { data: torneos, isLoading, error } = useGetMisTorneos();
  const eliminarTorneo = useEliminarTorneo();

  const handleEliminar = async (nombre: string) => {
    const confirmado = window.confirm(`¿Estás seguro que querés eliminar el torneo "${nombre}"?`);
    if (!confirmado) return;

    try {
      await eliminarTorneo.mutateAsync(nombre);
      alert("Torneo eliminado correctamente.");
    } catch (err: any) {
      alert(err.message || "Ocurrió un error al eliminar el torneo.");
    }
  };

  if (isLoading) return <div>Cargando torneos...</div>;
  if (error) return <div>Error al cargar torneos</div>;

  return (
      <CommonLayout>
        <div className={styles.pageWrapper}>
          <div className={styles.titleRow}>
            <span className={styles.trophyIcon}>⚙️</span>
            <span className={styles.title}>Mis Torneos</span>
          </div>

          {!torneos?.length && <p>No tenés torneos creados aún.</p>}

          <div className={styles.gridCards}>
            {torneos?.map((t: Torneo) => (
                <div key={t.nombre} className={styles.torneoCard}>
                  <div className={styles.cardHeader}>
                    <span className={styles.cardIcon}>🏟️</span>
                    <span className={styles.cardName}>{t.nombre}</span>
                  </div>
                  <div className={styles.cardDetail}><strong>Inicio:</strong> {t.fechaInicio}</div>
                  <div className={styles.cardDetail}><strong>Formato:</strong> {t.formato}</div>
                  <div className={styles.cardDetail}><strong>Máx equipos:</strong> {t.cantidadMaximaEquipos}</div>
                  <button
                      className={styles.inscribirseBtn}
                      onClick={() => navigate(`/admin/torneos/${encodeURIComponent(t.nombre)}`)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                      className={styles.eliminarBtn}
                      onClick={() => handleEliminar(t.nombre)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
            ))}
          </div>
        </div>
      </CommonLayout>
  );
};

export default MisTorneos;
