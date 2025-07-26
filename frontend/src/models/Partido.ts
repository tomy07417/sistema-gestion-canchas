import { z } from "zod";

export interface Partido {
  idPartido: number;
  canchaId: number;
  canchaNombre: string;
  canchaDireccion: string;
  fechaPartido: string;
  horaPartido: string;
  duracionMinutos: number;
  minJugador?: number;
  maxJugador?: number;
  cuposDisponibles: number;
  emailOrganizador: string;
  inscripto: boolean;
  partidoConfirmado: boolean;
  organizadorId?: number;
  jugadores?: Jugador[];
}

export interface Jugador {
  id: number;
  nombre: string;
  email: string;
}


export const CrearPartidoAbiertoSchema = z.object({
  canchaId: z.string().min(1, "La cancha es obligatoria"),
  fechaPartido: z.string().min(1, "La fecha es obligatoria"),
  horaPartido: z.string().min(1, "La hora es obligatoria"),
  minJugadores: z.string().min(1, "Jugadores mínimos es obligatorio"),
  maxJugadores: z.string().min(1, "Jugadores máximos es obligatorio"),
  cuposDisponibles: z.string().min(1, "Cupos disponibles es obligatorio"),
  equipo1: z.string().optional(),
  equipo2: z.string().optional(),
});

export const CrearPartidoCerradoSchema = z.object({
  canchaId: z.string().min(1, "La cancha es obligatoria"),
  fechaPartido: z.string().min(1, "La fecha es obligatoria"),
  horaPartido: z.string().min(1, "La hora es obligatoria"),
  minJugadores: z.string().optional(),
  maxJugadores: z.string().optional(),
  cuposDisponibles: z.string().optional(),
  equipo1: z.string().min(1, "Equipo 1 es obligatorio"),
  equipo2: z.string().min(1, "Equipo 2 es obligatorio"),
});

export type PartidoRequest = z.infer<typeof CrearPartidoAbiertoSchema>;
export type PartidoCerradoRequest = z.infer<typeof CrearPartidoCerradoSchema>;
