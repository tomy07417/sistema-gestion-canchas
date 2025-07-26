import { useLocation } from "wouter";
import { useGetMisEquipos } from "@/services/EquipoService";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { EquipoRequest } from "@/models/Equipo";
import styles from "../styles/AdminMisEquipos.module.css";

const MisEquipos = () => {
  const [, navigate] = useLocation();
  const { data: equipos, isLoading, error } = useGetMisEquipos();
  //const editarEquipo = useEditEquipo();

  if (isLoading) return <div>Cargando equipos...</div>;
  if (error) return <div>Error al cargar los equipos</div>;

  return (
    <CommonLayout>
      <div className={styles.pageWrapper}>
        <div className={styles.titleRow}>
          <span className={styles.shieldIcon}>🛡️</span>
          <span className={styles.title}>Mis Equipos</span>
        </div>

        {!equipos?.length && <p>No tenés equipos creados aún.</p>}

        <div className={styles.gridCards}>
          {equipos?.map((e: EquipoRequest) => (
            <div key={e.teamName} className={styles.equipoCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardIcon}>👥</span>
                <span className={styles.cardName}>{e.teamName}</span>
              </div>
              <div className={styles.cardDetail}><strong>Categoría:</strong> {e.category || "Sin categoría"}</div>
              <div className={styles.cardDetail}><strong>Colores:</strong> {e.mainColors} / {e.secondaryColors}</div>
              <button
                className={styles.editarBtn}
                onClick={() => navigate(`/admin/equipos/${encodeURIComponent(e.teamName)}`)}
              >
                ✏️ Editar
              </button>
            </div>
          ))}
        </div>
      </div>
    </CommonLayout>
  );
};

export default MisEquipos;
