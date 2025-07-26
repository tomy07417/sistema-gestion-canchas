import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {BASE_API_URL} from "@/config/app-query-client";
import {LoginRequest, LoginResponseSchema} from "@/models/Login";
import {useToken} from "@/services/TokenContext";

export function useLogin() {
  const [, setToken] = useToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (req: LoginRequest) => {
      const tokenData = await auth("/sessions", req);
      setToken({ state: "LOGGED_IN", ...tokenData });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        queryClient.refetchQueries({ queryKey: ["currentUser"] });
      }, 150);

      return tokenData;
    },
  });
}

export function usePedirTokenRecuperacion() {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await fetch(`${BASE_API_URL}/change-password`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(`Error al solicitar recuperación: ${errorText}`);
      }

      const result = await response.json();
      console.log(result);
      return result;
    },
  });
}

export function useCambiarContrasenia() {
  
  
  return useMutation({
    mutationFn: async ({ token, newPassword }: { token: string ; newPassword: string }) => {
      const response = await fetch(`${BASE_API_URL}/change-password/${token}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(`Error al cambiar contraseña: ${errorText}`);
      }

      return await response.json();
    },
  });
}

  
export function useSignup() {
  const [, setToken] = useToken();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const response = await fetch(BASE_API_URL + "/users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(`Error al registrar usuario: ${errorText}`);
      }
      const text = await response.json();
      console.log(text);
      setToken({ state: "LOGGED_IN", accessToken :text });

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        queryClient.refetchQueries({ queryKey: ["currentUser"] });
      }, 150);

      return text;
    },
  });
}

async function auth(endpoint: string, data: LoginRequest) {
  const response = await fetch(BASE_API_URL + endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return LoginResponseSchema.parse(await response.json());
  } else {
    throw new Error(
        `Failed with status ${response.status}: ${await response.text()}`
    );
  }
}

export type UserData = {
  nombre: string;
  email: string;
};

export async function fetchCurrentUser(): Promise<UserData | null> {
  const tokenData = JSON.parse(localStorage.getItem("token") ?? "{}");


  if (!tokenData?.accessToken) return null;

  try {
    const res = await fetch(BASE_API_URL + "/users/me", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${tokenData.accessToken}`,
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data as UserData;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export function useCurrentUser() {
  return useQuery<UserData | null>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      return await fetchCurrentUser();
    },
  });
}
