import { useToken } from "./TokenContext";

export function useAuthenticatedFetch() {
  const [tokenState] = useToken();

  return async function authFetch(input: RequestInfo, init?: RequestInit) {
    const headers = new Headers(init?.headers);

    if (tokenState.state === "LOGGED_IN" && tokenState.accessToken) {
      headers.set("Authorization", `Bearer ${tokenState.accessToken}`);
    }

    const response = await fetch(input, {
      ...init,
      headers,
    });

    return response;
  };
}
