import { type ReactNode, useCallback, useState } from "react";
import { AppContext } from "./appState";

export function AppProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);
  const toggleSidebar = useCallback(() => setSidebarCollapsed((c) => !c), []);

  return (
    <AppContext.Provider
      value={{ darkMode, sidebarCollapsed, galleryOpen, toggleDarkMode, toggleSidebar, setGalleryOpen }}
    >
      {children}
    </AppContext.Provider>
  );
}
