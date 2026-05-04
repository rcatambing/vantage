import { Navigate, useLocation } from "react-router";
import { NonIdealState, Spinner } from "@blueprintjs/core";
import { useAuth } from "../context/useAuth";
import type { SystemRole } from "../context/authState";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: SystemRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user, hasAnyRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          padding: 24,
        }}
      >
        <NonIdealState
          icon="shield"
          title="Unauthorized"
          description={`Your role (${user?.system_role ?? "unknown"}) does not have access to this resource.`}
        />
      </div>
    );
  }

  return <>{children}</>;
}
