import { useAuth } from "../context/useAuth";
import type { SystemRole } from "../context/authState";

interface RoleBasedVisibilityProps {
  children: React.ReactNode;
  allowedRoles: SystemRole[];
  fallback?: React.ReactNode;
}

export default function RoleBasedVisibility({
  children,
  allowedRoles,
  fallback = null,
}: RoleBasedVisibilityProps) {
  const { hasAnyRole } = useAuth();

  if (!hasAnyRole(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
