import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
      variant="ghost"
      size="icon"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
