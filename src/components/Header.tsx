// src/components/Header.tsx
import { HelpCircle, ArrowLeft, Ticket, User, Shield } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";
import { useAuth0 } from "@auth0/auth0-react";

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  onHelpClick?: () => void;
}

const Header = ({ showBack = false, title, onHelpClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

  // Correct role check (case insensitive)
  const isAdmin =
    user?.["https://distim.com/role"]?.toLowerCase() === "admin";

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border shadow-sm">
      <div className="container max-w-2xl mx-auto flex items-center justify-between h-16 px-4 gap-3">
        
        {/* Left Side */}
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="hover:bg-secondary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}

          <NavLink to="/" className="flex items-center gap-2">
            <img
              src="/assets/logo-full.png"
              alt="DisTim Logo"
              className="h-8 w-auto object-contain"
            />
            {title && (
              <span className="text-lg font-bold tracking-tight">{title}</span>
            )}
          </NavLink>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">

          <NavLink to="/passport">
            <Button variant="ghost" size="icon" className="hover:bg-secondary">
              <Ticket className="h-5 w-5" />
            </Button>
          </NavLink>

          {onHelpClick && (
            <Button variant="ghost" size="icon" onClick={onHelpClick}>
              <HelpCircle className="h-5 w-5" />
            </Button>
          )}

          <ThemeToggle />

          {/* ADMIN BUTTON (only visible to Admins) */}
          {isAuthenticated && isAdmin && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => navigate("/admin")}
            >
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          )}

          {/* Authentication buttons */}
          {!isLoading &&
            (isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-xs text-muted-foreground max-w-[140px] truncate">
                  {user?.email}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    logout({ logoutParams: { returnTo: window.location.origin } })
                  }
                >
                  <User className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => loginWithRedirect()}>
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Autentificare</span>
              </Button>
            ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
