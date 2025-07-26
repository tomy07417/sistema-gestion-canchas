import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import styles from "../styles/AdminReservas.module.css";
import { useGetMisReservas, useCancelarReserva} from "@/services/ReservasService";
import { useState } from "react";

export const AdministrarReservasScreen = () => {
  const [filtroFecha, setFiltroFecha] = useState<string>('');
  const [filtroHora, setFiltroHora] = useState<string>('');

  const { data: reservas } = useGetMisReservas();
  const { mutate: cancelarReserva } = useCancelarReserva();

  const reservasFiltradas = (reservas || [])
  .filter((reserva) => {
    const coincideFecha = filtroFecha ? reserva.fecha === filtroFecha : true;
    const coincideHora = filtroHora ? reserva.inicioTurno.startsWith(filtroHora) : true;
    return coincideFecha && coincideHora;
  })
  .sort((a, b) => {
    const fechaHoraA = new Date(`${a.fecha}T${a.inicioTurno}`);
    const fechaHoraB = new Date(`${b.fecha}T${b.inicioTurno}`);
    return fechaHoraA.getTime() - fechaHoraB.getTime();
  });


  const handleCancelarReserva = (reserva: any) => {
  if (confirm("¿Estás seguro de que querés cancelar esta reserva?")) {
    const reservaCancelada = {
      canchaName: reserva.canchaName,
      fecha: reserva.fecha,
      horaInicio: reserva.inicioTurno,
      horaFin: reserva.finTurno,
      state: "DISPONIBLE",
    };
    cancelarReserva(reservaCancelada);
  }
};
  
  return (
    <CommonLayout>
      <div className={styles.pageWrapper}>
        <div className={styles.titleRow}>
          <span className={styles.trophyIcon}>📋</span>
          <span className={styles.title}>Administracion de mis Reservas</span>
        </div>
      
        <div className={styles.filtersBox}>
          <input type="date" className={styles.filterInput} value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)}/>
          <input type="time" className={styles.filterInput} value={filtroHora} onChange={(e) => setFiltroHora(e.target.value)}/>
        </div>
      </div>

      {!reservas || reservas.length === 0 ? (<p>No tenés reservas aún.</p> ) : (
        <div className={styles.gridReservas}>
          {reservasFiltradas.map((reserva, idx) => (
            <div key={idx} className={styles.reservaCard}>
              <div className={styles.reservaHeader}>
                  <span className={styles.reservaNombre}>{reserva.canchaName}</span>
                  <span className={`${styles.reservaEstado} ${styles["estado" + reserva.state]}`}>
                    {reserva.state}
                  </span>
              </div>

              
              <p className={styles.reservaDetalle}>📅 {reserva.fecha}</p>
              <p className={styles.reservaDetalle}>⏰ {reserva.inicioTurno} - {reserva.finTurno}</p>
              <p className={styles.reservaDetalle}>📍 {reserva.direccion}, {reserva.zona}</p>
              
              {reserva.tipoPartido && (
                  <p className={styles.reservaDetalle}>👥 Tipo de partido: {reserva.tipoPartido}</p>
                )}
                {reserva.emailOrganizador && (
                  <p className={styles.reservaDetalle}>📧 Organizador: {reserva.emailOrganizador}</p>
                )}
                
              {reserva.state === "OCUPADA" && (
                <button className={styles.cancelButton} onClick={() => handleCancelarReserva(reserva)}>
                  Cancelar
                  </button>
              )}
            </div>
          ))}
        </div>
      )}
    </CommonLayout>
  );
};
export default AdministrarReservasScreen;