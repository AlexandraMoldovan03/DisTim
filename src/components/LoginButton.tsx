import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "./ui/button";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Button onClick={() => loginWithRedirect()} variant="outline" size="sm">
      Login
    </Button>
  );
};

export default LoginButton;
