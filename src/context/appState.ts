import { createContext } from "react";

export interface AppState {
  darkMode: boolean;
  sidebarCollapsed: boolean;
  galleryOpen: boolean;
  isAuthenticated: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  setGalleryOpen: (open: boolean) => void;
  setAuthenticated: (auth: boolean) => void;
}

export const AppContext = createContext<AppState | null>(null);
