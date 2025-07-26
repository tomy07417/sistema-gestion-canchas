import { z } from "zod";



export const FormatoTorneoEnum = z.enum([
  "ELIMINACION_DIRECTA",
  "FASE_GRUPOS_ELIMINACION",
  "LIGA",
]);

export const TorneoRequestSchema = z.object({
  nombre: z.string().min(1, "El nombre del torneo es obligatorio"),
  fechaInicio: z.string().min(1, "La fecha de inicio es obligatoria"),
  formato: FormatoTorneoEnum,
  cantidadMaximaEquipos: z.number().int().positive("Debe ser mayor a 0"),
  fechaFin: z.string(),
  descripcion: z.string(),
  premios: z.string(),
  costoInscripcion: z.number(),
});

export type TorneoRequest = z.infer<typeof TorneoRequestSchema>;
export interface Torneo extends TorneoRequest {
  id: number;
  estado: "Abierto" | "Cerrado" | "En curso" | "Finalizado";
  creadorId: number;
}


export interface TorneoDisponible {
  id: number;
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  formato: "ELIMINACION_DIRECTA" | "FASE_GRUPOS_ELIMINACION" | "LIGA";
  cantidadMaximaEquipos: number;
  descripcion: string;
  premios: string;
  costoInscripcion: number;
  estado: "ABIERTO" | "EN_CURSO" | "FINALIZADO";
  organizadorId: number;
}
