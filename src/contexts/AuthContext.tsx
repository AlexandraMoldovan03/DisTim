// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useAuth0, User as Auth0User } from "@auth0/auth0-react";

interface AuthContextType {
  user: Auth0User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login: () => loginWithRedirect(),
    logout: () =>
      logout({
        logoutParams: { returnTo: window.location.origin },
      }),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
