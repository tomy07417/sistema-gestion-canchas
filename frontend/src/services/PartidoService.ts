import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import { BASE_API_URL } from "@/config/app-query-client";
import { useToken } from "@/services/TokenContext";
import {
    Partido,
    PartidoRequest,
    PartidoCerradoRequest,
} from "@/models/Partido";

type PartidoKey = {
    canchaId: number;
    fechaPartido: string;
    horaPartido: string;
};

export function useCrearPartidoAbierto(options?: {
    onSuccess?: (data: Partido) => void;
    onError?: (error: unknown) => void;
}) {
    const [tokenState] = useToken();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (dto: PartidoRequest) => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado. No se puede crear un partido.");
            }
            const res = await fetch(`${BASE_API_URL}/partidos/abierto`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenState.accessToken}`,
                },
                body: JSON.stringify(dto),
            });
            if (!res.ok) throw new Error(await res.text());
            return (await res.json()) as unknown as Partido;
        },
        onSuccess: (data) => {
            void qc.invalidateQueries({ queryKey: ["reservasDisponibles"] });
            options?.onSuccess?.(data);
        },
        onError: options?.onError,
    });
}

export function useCrearPartidoCerrado(options?: {
    onSuccess?: (data: Partido) => void;
    onError?: (error: unknown) => void;
}) {
    const [tokenState] = useToken();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (dto: PartidoCerradoRequest) => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado. No se puede crear un partido.");
            }
            const res = await fetch(`${BASE_API_URL}/partidos/cerrado`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenState.accessToken}`,
                },
                body: JSON.stringify(dto),
            });
            if (!res.ok) throw new Error(await res.text());
            return (await res.json()) as unknown as Partido;
        },
        onSuccess: (data) => {
            void qc.invalidateQueries({ queryKey: ["reservasDisponibles"] });
            options?.onSuccess?.(data);
        },
        onError: options?.onError,
    });
}

export function usePartidosAbiertos() {
    const [tokenState] = useToken();

    return useQuery<Partido[]>({
        queryKey: ["partidosAbiertos"],
        enabled: tokenState.state === "LOGGED_IN",
        queryFn: async () => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado.");
            }
            const res = await fetch(`${BASE_API_URL}/partidos/abiertos`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${tokenState.accessToken}`,
                },
            });
            if (!res.ok) throw new Error(await res.text());
            return (await res.json()) as unknown as Partido[];
        },
    });
}

export function useInscribirPartido() {
    const [tokenState] = useToken();

    return useMutation({
        mutationFn: async ({
                               canchaId,
                               fechaPartido,
                               horaPartido,
                           }: PartidoKey) => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado.");
            }
            const response = await fetch(
                `${BASE_API_URL}/partidos/abierto/inscribir/${canchaId}/${fechaPartido}/${horaPartido}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${tokenState.accessToken}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error(await response.text());
            }
            return await response.json();
        },
    });
}

export function useDesinscribirPartido() {
    const [tokenState] = useToken();
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async ({ canchaId, fechaPartido, horaPartido }: PartidoKey) => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado.");
            }
            const res = await fetch(
                `${BASE_API_URL}/partidos/abierto/desinscribir/${canchaId}/${fechaPartido}/${horaPartido}`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokenState.accessToken}`,
                    },
                }
            );
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ["partidosAbiertos"] });
            void qc.invalidateQueries({ queryKey: ["reservasDisponibles"] });
        },
    });
}

export function useGenerarInvitacion() {
    return useMutation({
        mutationFn: async ({
                               canchaId,
                               fechaPartido,
                               horaPartido,
                               accessToken,
                           }: {
            canchaId: number;
            fechaPartido: string;
            horaPartido: string;
            accessToken: string;
        }) => {
            const url = `${BASE_API_URL}/partidos/abierto/${canchaId}/${fechaPartido}/${horaPartido}/invitar`;
            const options: RequestInit = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            };
            const resp = await fetch(url, options);
            if (!resp.ok) {
                throw new Error("Error generando la invitación");
            }
            return resp.json();
        }
    });
}
