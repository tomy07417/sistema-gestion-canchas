import { BASE_API_URL } from "@/config/app-query-client";
import { useToken } from "@/services/TokenContext";
import { useCallback } from "react";

export function useObtenerHistorialPartidos() {
    const [tokenState] = useToken();

    const getHistorial = useCallback(async () => {
        if (tokenState.state !== "LOGGED_IN") throw new Error("No logueado");
        const res = await fetch(`${BASE_API_URL}/partidos/mis-partidos`, {
            headers: {
                "Authorization": `Bearer ${tokenState.accessToken}`,
                "Accept": "application/json"
            }
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    }, [
        tokenState.state,
        tokenState.state === "LOGGED_IN" ? tokenState.accessToken : null
    ]);

    return { getHistorial };
}
