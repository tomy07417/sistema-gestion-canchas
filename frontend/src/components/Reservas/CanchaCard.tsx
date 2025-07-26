import React from "react";
import styles from "./ReservasScreen.module.css";
import { ReservaDisponibleDTO } from "@/services/ReservasService";

interface Props {
    info: ReservaDisponibleDTO;
    slots: ReservaDisponibleDTO[];
    selectedSlot: ReservaDisponibleDTO | null;
    onSelect: (s: ReservaDisponibleDTO) => void;
    onReservar: () => void;
}

export const CanchaCard: React.FC<Props> = ({
                                                info,
                                                slots,
                                                selectedSlot,
                                                onSelect,
                                                onReservar,
                                            }) => {
    const isSelected = !!selectedSlot;

    return (
        <li className={styles.card}>
            <div className={styles.infoBlock}>
                <div className={styles.metaRow}>
                    <span className={styles.canchaName}>{info.canchaName}</span>
                    <span className={styles.bullet}>•</span>
                    <span>{info.zona}</span>
                    <span className={styles.bullet}>•</span>
                    <span>{info.direccion}</span>
                </div>

                <div className={styles.slotList}>
                    {slots.map((s) => {
                        const active = selectedSlot?.inicioTurno === s.inicioTurno;
                        return (
                            <button
                                key={s.inicioTurno}
                                className={`${styles.slotBtn} ${active ? styles.slotBtnSelected : ""}`}
                                onClick={() => onSelect(s)}
                            >
                                {s.inicioTurno.slice(0, 5)}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className={styles.reserveAction}>
                <button
                    className={styles.reserveBtn}
                    disabled={!isSelected}
                    onClick={onReservar}
                >
                    Reservar
                </button>
            </div>
        </li>
    );
};
