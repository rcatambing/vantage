export type SystemRole =
  | "SUPERADMIN"
  | "MANAGER"
  | "SUPERVISOR"
  | "POLITICAL_OFFICER"
  | "STAFF"
  | "VOLUNTEER";

export interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  system_role: SystemRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: SystemRole[]) => boolean;
  hasAnyRole: (roles: SystemRole[]) => boolean;
}
