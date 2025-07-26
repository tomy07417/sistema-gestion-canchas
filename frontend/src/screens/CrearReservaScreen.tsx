import React, { useMemo, useState } from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useReservasDisponibles, ReservaDisponibleDTO } from "@/services/ReservasService";
import { useCrearPartidoAbierto, useCrearPartidoCerrado } from "@/services/PartidoService";
import { FiltersBar } from "@/components/Reservas/FiltersBar";
import { SuccessAlert } from "@/components/Reservas/SuccesAlert";
import { ReservaModal } from "@/components/Reservas/ReservaModal";
import { CanchaCard } from "@/components/Reservas/CanchaCard";
import styles from "../components/Reservas/ReservasScreen.module.css";

export const ReservasScreen: React.FC = () => {
    const todayIso = new Date().toISOString().slice(0, 10);
    const [fecha, setFecha] = useState(todayIso);
    const [zona, setZona] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    const [selectedCanchaId, setSelectedCanchaId] = useState<number | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<ReservaDisponibleDTO | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [step, setStep] = useState<"tipo" | "datos">("tipo");
    const [tipo, setTipo] = useState<"abierto" | "cerrado" | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const [formAbierto, setFormAbierto] = useState({ minJugadores: "", maxJugadores: "", cupos: "" });
    const [formCerrado, setFormCerrado] = useState({ equipo1: "", equipo2: "" });

    const { data: reservas = [], isLoading, isError } = useReservasDisponibles({ fecha, zona });

    const zonasDisponibles = useMemo(
        () => Array.from(new Set(reservas.map((r) => r.zona))),
        [reservas]
    );

    const reservasFiltradas = useMemo(() => {
        if (!search.trim()) return reservas;
        const q = search.toLowerCase();
        return reservas.filter(
            (r) =>
                r.canchaName.toLowerCase().includes(q) ||
                r.zona.toLowerCase().includes(q) ||
                r.direccion.toLowerCase().includes(q)
        );
    }, [reservas, search]);

    const canchas = useMemo(() => {
        const m = new Map<number, { info: ReservaDisponibleDTO; slots: ReservaDisponibleDTO[] }>();
        reservasFiltradas.forEach((r) => {
            if (!m.has(r.canchaId)) m.set(r.canchaId, { info: r, slots: [] });
            m.get(r.canchaId)!.slots.push(r);
        });
        return Array.from(m.values());
    }, [reservasFiltradas]);

    const resetModal = () => {
        setStep("tipo"); setTipo(null);
        setFormAbierto({ minJugadores: "", maxJugadores: "", cupos: "" });
        setFormCerrado({ equipo1: "", equipo2: "" });
        setSelectedSlot(null); setSelectedCanchaId(null);
    };

    const crearAbierto = useCrearPartidoAbierto({
        onSuccess: () => { setShowModal(false); resetModal(); setShowSuccess(true); },
    });
    const crearCerrado = useCrearPartidoCerrado({
        onSuccess: () => { setShowModal(false); resetModal(); setShowSuccess(true); },
    });

    const confirmAbierto = () => {
        if (!selectedSlot) return;
        crearAbierto.mutate({
            canchaId: selectedSlot.canchaId,
            fechaPartido: selectedSlot.fecha,
            horaPartido: selectedSlot.inicioTurno,
            minJugadores: Number(formAbierto.minJugadores),
            maxJugadores: Number(formAbierto.maxJugadores),
            cuposDisponibles: Number(formAbierto.cupos),
            duracionMinutos: selectedSlot.duracionMinutos,
        } as any);
    };
    const confirmCerrado = () => {
        if (!selectedSlot) return;
        crearCerrado.mutate({
            canchaId: selectedSlot.canchaId,
            fechaPartido: selectedSlot.fecha,
            horaPartido: selectedSlot.inicioTurno,
            equipo1: formCerrado.equipo1,
            equipo2: formCerrado.equipo2,
            duracionMinutos: selectedSlot.duracionMinutos,
        } as any);
    };


    return (
        <CommonLayout>
            <SuccessAlert visible={showSuccess} onClose={() => setShowSuccess(false)} />

            <h1 className={styles.title}>Canchas Disponibles</h1>

            <FiltersBar
                fecha={fecha} onFecha={setFecha}
                zona={zona} onZona={setZona}
                zonasDisponibles={zonasDisponibles}
                search={search} onSearch={setSearch}
            />

            {isLoading && <p>Cargando reservas…</p>}
            {isError && <p>Error al obtener las reservas.</p>}
            {!isLoading && canchas.length === 0 && <p>No se encontraron reservas.</p>}

            <ul className={styles.cardList}>
                {canchas.map(({ info, slots }) => (
                    <CanchaCard
                        key={info.canchaId}
                        info={info}
                        slots={slots}
                        selectedSlot={selectedCanchaId === info.canchaId ? selectedSlot : null}
                        onSelect={(s) => { setSelectedCanchaId(info.canchaId); setSelectedSlot(s); }}
                        onReservar={() => selectedSlot && setShowModal(true)}
                    />
                ))}
            </ul>

            {showModal && selectedSlot && (
                <ReservaModal
                    slot={selectedSlot}
                    step={step}
                    tipo={tipo}
                    onTipo={(t) => { setTipo(t); setStep("datos"); }}
                    formAbierto={formAbierto} setFormAbierto={setFormAbierto}
                    formCerrado={formCerrado} setFormCerrado={setFormCerrado}
                    onConfirm={tipo === "abierto" ? confirmAbierto : confirmCerrado}
                    onBack={() => setStep("tipo")}
                    onClose={() => { setShowModal(false); resetModal(); }}
                    pending={crearAbierto.isPending || crearCerrado.isPending}
                />
            )}
        </CommonLayout>
    );
};
