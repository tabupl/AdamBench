import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import type { AuthContextValue } from "../types/auth";

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}
