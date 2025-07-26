import { z } from "zod";

export const EquipoRequestSchema = z.object({
    teamName: z.string().min(1, "El nombre es requerido"),
    category: z.string(),
    mainColors: z.string(),
    secondaryColors: z.string(),
});

export interface EquipoRequest {
    teamName: string;
    category: string;
    mainColors: string;
    secondaryColors: string;
}

export interface EquipoResponse {
    teamName: string;
    category: string;
    mainColors: string;
    secondaryColors: string;
    captainId: number;
}
