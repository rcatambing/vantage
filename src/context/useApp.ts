import { useContext } from "react";
import { AppContext } from "./appState";
import type { AppState } from "./appState";

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
