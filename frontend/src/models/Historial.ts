export type Jugador = {
    id: number;
    nombre: string;
    email: string;
};

export type PartidoAbiertoResponseDTO = {
    idPartido: number;
    canchaNombre: string;
    canchaDireccion: string;
    fechaPartido: string;
    horaPartido: string;
    minJugador: number;
    maxJugador: number;
    cuposDisponibles: number;
    organizadorId: number;
    emailOrganizador: string;
    inscripto: boolean;
    partidoConfirmado: boolean;
    jugadores: Jugador[];
};

export type PartidoCerradoResponseDTO = {
    idPartido: number;
    canchaNombre: string;
    canchaDireccion: string;
    fechaPartido: string;
    horaPartido: string;
    equipo1: string;
    equipo2: string;
    organizadorId: number;
    emailOrganizador: string;
};
