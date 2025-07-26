import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_API_URL } from "@/config/app-query-client";
import { useToken } from "@/services/TokenContext";
import { EquipoRequest, EquipoResponse } from "@/models/Equipo";

export function useCrearEquipo(options?: {
    onSuccess?: (data: EquipoResponse) => void;
    onError?: (error: unknown) => void;
}) {
    const [tokenState] = useToken();

    return useMutation({
        mutationFn: async (data: EquipoRequest) => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado.");
            }

            const response = await fetch(`${BASE_API_URL}/equipos`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenState.accessToken}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorText = await response.text();
                options?.onError?.(new Error(`Error al crear equipo: ${errorText}`));
                throw new Error(`Error al crear equipo: ${errorText}`);
            }

            const equipoCreado = await response.json();
            options?.onSuccess?.(equipoCreado);
            return equipoCreado;
        },
    });
}

export function useGetMisEquipos() {
    const [tokenState] = useToken();

    return useQuery<EquipoResponse[]>({
        queryKey: ["misEquipos"],
        queryFn: async () => {
            if (tokenState.state !== "LOGGED_IN") {
                throw new Error("No estás logueado.");
            }

            const response = await fetch(BASE_API_URL + "/equipos", {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${tokenState.accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Error al cargar tus equipos");
            }
            return (await response.json()) as EquipoResponse[];
        },
        enabled: tokenState.state === "LOGGED_IN",
    });
}

export function useEditEquipo (options?: {
  onSuccess?: (data: EquipoRequest) => void;
  onError?: (error: unknown) => void;
}) {
  const [tokenState] = useToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ nombre, data }: { nombre: string, data: Partial<EquipoRequest> }) => {
      if (tokenState.state !== "LOGGED_IN") {
        throw new Error("No estás logueado. No se puede editar el equipo.");
      }

      const response = await fetch(`${BASE_API_URL}/equipos/${nombre}`, {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenState.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al editar al equipo: ${errorText}`);
      }

      return (await response.json()) as EquipoRequest;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["misEquipos"] });
      if (options?.onSuccess) options.onSuccess(data);
    },
    onError: options?.onError,
  });
}
