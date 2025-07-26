import { z } from "zod";


export interface Reserva {
    canchaId: number;
    fecha: string;   
    horaInicio: string;
    horaFin: string;
}

export const CrearReservaSchema = z.object({
    canchaId: z.string().min(1, "La cancha es obligatoria"),
    fecha: z.string().min(1, "La fecha es obligatoria"),
    horaInicio: z.string().min(1, "La hora de inicio es obligatoria"),
    horaFin: z.string().min(1, "La hora de fin es obligatoria"),
});

export type ReservaRequest = z.infer<typeof CrearReservaSchema>;

export interface ReservaResponse {
  canchaId: number;
  canchaName: string;
  zona: string;
  direccion: string;
  fecha: string;
  inicioTurno: string;
  finTurno: string;
  state: "OCUPADA" | "DISPONIBLE";
  tipoPartido: "CERRADO" | "ABIERTO" | null;
  emailOrganizador: string | null;
}

export interface ReservaIdDTO {
  canchaName: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  state: string;
}