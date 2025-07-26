import React from "react";
import styles from "./ReservasScreen.module.css";

interface Props {
    fecha: string;
    onFecha: (v: string) => void;
    zona: string | null;
    onZona: (v: string | null) => void;
    zonasDisponibles: string[];
    search: string;
    onSearch: (v: string) => void;
}

export const FiltersBar: React.FC<Props> = ({
                                                fecha,
                                                onFecha,
                                                zona,
                                                onZona,
                                                zonasDisponibles,
                                                search,
                                                onSearch,
                                            }) => (
    <div className={styles.filtersRow}>
        <div className={styles.fieldGroup}>
            <span className={styles.calendarIcon} />
            <input type="date" value={fecha} onChange={(e) => onFecha(e.target.value)} />
        </div>

        <select
            className={styles.locationSelect}
            value={zona ?? ""}
            onChange={(e) => onZona(e.target.value || null)}
        >
            <option value="">Todas las ubicaciones</option>
            {zonasDisponibles.map((z) => (
                <option key={z} value={z}>
                    {z}
                </option>
            ))}
        </select>

        <input
            className={styles.searchInput}
            type="search"
            placeholder="Buscar cancha, zona o dirección"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
        />
    </div>
);
