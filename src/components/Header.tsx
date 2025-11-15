// src/components/Header.tsx
import { useState } from "react";
import { HelpCircle, ArrowLeft, Ticket } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  onHelpClick?: () => void;
}

const Header = ({ showBack = false, title, onHelpClick }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, signIn, signUp, signOut, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      setStatus("Te rog completează email și parolă.");
      return;
    }

    try {
      setStatus(mode === "login" ? "Te conectăm..." : "Îți creăm contul...");

      if (mode === "login") {
        await signIn(email, password);
        setStatus(null);
      } else {
        await signUp(email, password);
        setStatus("Cont creat. Te poți conecta acum cu datele introduse.");
        setMode("login");
      }

      setPassword("");
    } catch (e: any) {
      console.error(e);
      setStatus(e.message || "A apărut o eroare la autentificare.");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border shadow-sm">
      <div className="container max-w-2xl mx-auto flex items-center justify-between h-16 px-4 gap-3">
        {/* STÂNGA: back + logo + titlu */}
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
            <span className="text-lg font-bold tracking-tight">
              {title || "DisTim"}
            </span>
          </NavLink>
        </div>

        {/* DREAPTA: passport + help + theme + auth */}
        <div className="flex items-center gap-2">
          {/* buton passport */}
          <NavLink to="/passport">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-secondary"
              title="Virtual Passport"
            >
              <Ticket className="h-5 w-5" />
            </Button>
          </NavLink>

          {/* help */}
          {onHelpClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onHelpClick}
              className="hover:bg-secondary"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          )}

          {/* tema light/dark */}
          <ThemeToggle />

          {/* autentificare */}
          {!loading &&
            (user ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground max-w-[120px] truncate">
                  {user.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut().catch(console.error)}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-8 px-2 rounded-md border border-input bg-background text-xs w-32 sm:w-40"
                />
                <input
                  type="password"
                  placeholder="Parolă"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-8 px-2 rounded-md border border-input bg-background text-xs w-24 sm:w-32"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSubmit}
                >
                  {mode === "login" ? "Login" : "Register"}
                </Button>
                <button
                  type="button"
                  onClick={() =>
                    setMode(mode === "login" ? "register" : "login")
                  }
                  className="text-[11px] text-muted-foreground underline"
                >
                  {mode === "login" ? "Creează cont" : "Am deja cont"}
                </button>
              </div>
            ))}
        </div>
      </div>

      {status && (
        <p className="text-[11px] text-center text-muted-foreground pb-2">
          {status}
        </p>
      )}
    </header>
  );
};

export default Header;
