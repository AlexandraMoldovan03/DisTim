// src/components/PrivateAdminRoute.tsx
import { ReactNode } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

interface PrivateAdminRouteProps {
  children: ReactNode;
}

const PrivateAdminRoute = ({ children }: PrivateAdminRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  const role = user?.["https://distim.com/role"];
  const isAdmin = role?.toLowerCase() === "admin";

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateAdminRoute;
