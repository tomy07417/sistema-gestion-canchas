import { z } from "zod";

export const CanchaRequestSchema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    tipoCesped: z.enum(["Sintetico", "Natural"], {
        errorMap: () => ({ message: "Debes elegir entre sintético o natural" }),
    }),
    iluminacion: z.boolean(),
    zona: z.string().min(1, "La zona es obligatoria"),
    direccion: z.string().min(1, "La dirección es obligatoria"),
    desde: z.string(),
    hasta: z.string(),
    horaInicio: z.string(),
    horaFin: z.string(),
    duracionMinutos: z.number(),
});

export type CanchaRequest = z.infer<typeof CanchaRequestSchema>;

export type FranjasAux = {
    desde: string;
    hasta: string;
    horaInicio: string;
    horaFin: string;
    duracionMinutos: number;
};

export interface Cancha extends CanchaRequest {
    id: number;
    activa?: boolean;
}

export interface CanchaEditRequest extends Partial<CanchaRequest> {
    activa?: boolean;
}
