import React, { Dispatch, useContext, useState, useEffect } from "react";

type TokenContextData =
  | {
      state: "LOGGED_OUT";
    }
  | {
      state: "LOGGED_IN";
      accessToken: string;

    };

const TokenContext = React.createContext<[TokenContextData, Dispatch<TokenContextData>] | null>(null);

export const TokenProvider = ({ children }: React.PropsWithChildren) => {
  const [state, setState] = useState<TokenContextData>(() => {
    const saved = localStorage.getItem("token");
    return saved ? JSON.parse(saved) : { state: "LOGGED_OUT" };
  });

  useEffect(() => {
    localStorage.setItem("token", JSON.stringify(state));
  }, [state]);

  return <TokenContext.Provider value={[state, setState]}>{children}</TokenContext.Provider>;
};
export function useToken() {
  const context = useContext(TokenContext);
  if (context === null) {
    throw new Error("React tree should be wrapped in TokenProvider");
  }
  return context;
}
