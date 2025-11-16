// src/pages/AuthPage.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const AuthPage = () => {
  const { handleRedirectCallback, isLoading, error } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        // finalizează fluxul de redirect de la Auth0
        await handleRedirectCallback();

        // citim ?returnTo=... din URL-ul paginii /auth
        const params = new URLSearchParams(location.search);
        const returnTo = params.get("returnTo");

        // dacă avem returnTo => mergem acolo, altfel pe homepage
        navigate(returnTo || "/", { replace: true });
      } catch (e) {
        console.error("Eroare în handleRedirectCallback:", e);
        navigate("/", { replace: true });
      }
    };

    run();
  }, [handleRedirectCallback, location.search, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Se finalizează autentificarea...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-500">
          Eroare la autentificare: {error.message}
        </p>
      </div>
    );
  }

  return null;
};

export default AuthPage;