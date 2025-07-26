import { jwtDecode } from "jwt-decode";

export function getUserRole(token: string): string | null {
  try {
    const payload: any = jwtDecode(token);
    return payload.role || null;
  } catch (e) {
    console.error("Error al decodificar el token", e);
    return null;
  }
}