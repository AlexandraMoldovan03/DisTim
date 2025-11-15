// src/pages/AuthPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const AuthPage = () => {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // dacă ești deja logată, nu mai are sens pagina asta
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setStatus("Te rog completează email și parolă.");
      return;
    }

    try {
      setStatus(
        mode === "login"
          ? "Te conectăm..."
          : "Îți creăm contul..."
      );

      if (mode === "login") {
        await signIn(email, password);
        setStatus(null);
        navigate("/"); // după login, mergem acasă
      } else {
        await signUp(email, password);
        setStatus(
          "Cont creat. Te poți conecta acum cu datele introduse."
        );
        setMode("login");
        setPassword("");
      }
    } catch (e: any) {
      console.error(e);
      setStatus(e.message || "A apărut o eroare la autentificare.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header showBack title="Autentificare" />

      <main className="container max-w-md mx-auto px-4 py-8">
        <section className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
          <h1 className="text-2xl font-bold text-center mb-2">
            {mode === "login" ? "Intră în DisTim" : "Creează-ți un cont"}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Salvează-ți ștampilele culturale și urmărește-ți progresul
            prin Timișoara.
          </p>

          {/* switch login / register */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button
              variant={mode === "login" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("login")}
            >
              Login
            </Button>
            <Button
              variant={mode === "register" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("register")}
            >
              Register
            </Button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                placeholder="ex: timisoara@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Parolă</label>
              <input
                type="password"
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                placeholder="minim 6 caractere"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading
                ? "Se procesează..."
                : mode === "login"
                ? "Intră în cont"
                : "Creează cont"}
            </Button>
          </form>

          {status && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              {status}
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default AuthPage;
