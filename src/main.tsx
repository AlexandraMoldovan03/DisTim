// src/main.tsx sau src/main.tsx (depinde cum se numește la tine)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import "leaflet/dist/leaflet.css";

// 👇 funcție care decide unde te duci după login
const onRedirectCallback = (appState?: { returnTo?: string }) => {
  const targetUrl = appState?.returnTo || window.location.pathname;
  // ne mutăm fără reload complet
  window.history.replaceState({}, "", targetUrl);
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        // Auth0 se întoarce la origin (fără /auth)
        redirect_uri: window.location.origin,
      }}
      // aici primim appState.returnTo din loginWithRedirect
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
