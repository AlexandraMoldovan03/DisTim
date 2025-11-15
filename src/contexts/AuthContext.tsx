// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // verificăm user-ul curent folosind mai întâi sesiunea
  const checkUser = async () => {
    try {
      setLoading(true);

      // 1. luăm sesiunea
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Eroare getSession:", error.message);
        setUser(null);
        setLoading(false);
        return;
      }

      // 2. dacă nu există sesiune, nu mai chemăm getUser
      if (!session) {
        setUser(null);
        setLoading(false);
        return;
      }

      // 3. avem sesiune, putem cere user-ul
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Eroare getUser:", userError.message);
        setUser(null);
      } else {
        setUser(user);
      }
    } catch (e) {
      console.error("Eroare necunoscută în checkUser:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // la mount
    checkUser();

    // ascultăm schimbările de auth (login/logout/register)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // helper: creăm rând în profiles dacă nu există
  const createProfileIfNeeded = async (user: User | null) => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        email: user.email,
        display_name: user.email, // poți schimba ulterior
      })
      .select()
      .single();

    // dacă profilul există deja (duplicate key), ignorăm
    if (error && error.code !== "23505") {
      console.error("Eroare la insert în profiles:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      console.error(error);
      throw error;
    }

    setUser(data.user ?? null);
    await createProfileIfNeeded(data.user ?? null);
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      console.error(error);
      throw error;
    }

    // dacă ai dezactivat confirmarea de email, session + user sunt deja setate
    const newUser = data.user ?? null;
    setUser(newUser);
    await createProfileIfNeeded(newUser);
  };

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      console.error(error);
      throw error;
    }

    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
