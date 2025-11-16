// src/pages/AuthPage.tsx
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const { handleRedirectCallback, isLoading, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        // finalizează fluxul de redirect Auth0
        await handleRedirectCallback();

        // după autentificare, mergem simplu pe pagina principală
        navigate("/", { replace: true });
      } catch (e) {
        console.error("Eroare în handleRedirectCallback:", e);
        navigate("/", { replace: true });
      }
    };

    run();
  }, [handleRedirectCallback, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Se finalizează autentificarea...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Eroare la autentificare: {error.message}</p>
      </div>
    );
  }

  return null;
};

export default AuthPage;
