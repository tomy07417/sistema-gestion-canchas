import React from "react";
import styles from "./ReservasScreen.module.css";

interface Props {
    visible: boolean;
    onClose: () => void;
}

export const SuccessAlert: React.FC<Props> = ({ visible, onClose }) => {
    if (!visible) return null;

    return (
        <div className={styles.alertOverlay}>
            <div className={styles.alertBox}>
                <p className={styles.alertMsg}>¡Reserva exitosa!</p>
                <button className={styles.alertBtn} onClick={onClose}>
                    Aceptar
                </button>
            </div>
        </div>
    );
};
