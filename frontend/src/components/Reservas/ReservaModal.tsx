import React from "react";
import { ReservaDisponibleDTO } from "@/services/ReservasService";
import styles from "./ReservasScreen.module.css";

interface FormAbierto {
    minJugadores: string;
    maxJugadores: string;
    cupos: string;
}
interface FormCerrado {
    equipo1: string;
    equipo2: string;
}
interface Props {
    slot: ReservaDisponibleDTO;
    step: "tipo" | "datos";
    tipo: "abierto" | "cerrado" | null;
    onTipo: (t: "abierto" | "cerrado") => void;
    formAbierto: FormAbierto;
    setFormAbierto: (f: FormAbierto) => void;
    formCerrado: FormCerrado;
    setFormCerrado: (f: FormCerrado) => void;
    onConfirm: () => void;
    onBack: () => void;
    onClose: () => void;
    pending: boolean;
}

export const ReservaModal: React.FC<Props> = (p) => (
    <div className={styles.modalOverlay} onClick={p.onClose}>
        <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={p.onClose}>
                ×
            </button>

            {p.step === "tipo" && (
                <>
                    <h2>Seleccionar tipo de partido</h2>
                    <p>
                        {p.slot.canchaName} – {p.slot.inicioTurno.slice(0, 5)} a{" "}
                        {p.slot.finTurno.slice(0, 5)}
                    </p>
                    <div className={styles.modalBtns}>
                        <button className={styles.modalBtn} onClick={() => { p.onTipo("abierto"); }}>
                            Abierto
                        </button>
                        <button className={styles.modalBtn} onClick={() => { p.onTipo("cerrado"); }}>
                            Cerrado
                        </button>
                    </div>
                </>
            )}

            {p.step === "datos" && p.tipo === "abierto" && (
                <>
                    <h2>Partido abierto</h2>
                    <label>
                        Mín. jugadores
                        <input
                            type="number"
                            value={p.formAbierto.minJugadores}
                            onChange={(e) =>
                                p.setFormAbierto({ ...p.formAbierto, minJugadores: e.target.value })
                            }
                        />
                    </label>
                    <label>
                        Máx. jugadores
                        <input
                            type="number"
                            value={p.formAbierto.maxJugadores}
                            onChange={(e) =>
                                p.setFormAbierto({ ...p.formAbierto, maxJugadores: e.target.value })
                            }
                        />
                    </label>
                    <label>
                        Cupos disponibles
                        <input
                            type="number"
                            value={p.formAbierto.cupos}
                            onChange={(e) =>
                                p.setFormAbierto({ ...p.formAbierto, cupos: e.target.value })
                            }
                        />
                    </label>
                    <div className={styles.modalBtns}>
                        <button
                            className={styles.modalBtn}
                            onClick={p.onConfirm}
                            disabled={p.pending}
                        >
                            Confirmar
                        </button>
                        <button className={styles.modalBtn} onClick={p.onBack}>
                            Volver
                        </button>
                    </div>
                </>
            )}

            {p.step === "datos" && p.tipo === "cerrado" && (
                <>
                    <h2>Partido cerrado</h2>
                    <label>
                        Equipo 1
                        <input
                            type="text"
                            value={p.formCerrado.equipo1}
                            onChange={(e) =>
                                p.setFormCerrado({ ...p.formCerrado, equipo1: e.target.value })
                            }
                        />
                    </label>
                    <label>
                        Equipo 2
                        <input
                            type="text"
                            value={p.formCerrado.equipo2}
                            onChange={(e) =>
                                p.setFormCerrado({ ...p.formCerrado, equipo2: e.target.value })
                            }
                        />
                    </label>
                    <div className={styles.modalBtns}>
                        <button
                            className={styles.modalBtn}
                            onClick={p.onConfirm}
                            disabled={p.pending}
                        >
                            Confirmar
                        </button>
                        <button className={styles.modalBtn} onClick={p.onBack}>
                            Volver
                        </button>
                    </div>
                </>
            )}
        </div>
    </div>
);
