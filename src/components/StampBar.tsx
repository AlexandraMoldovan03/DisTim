// src/components/StampBar.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth0 } from "@auth0/auth0-react";

export interface Stamp {
  totem_id: string;
  stamp_label: string;
  stamp_emoji: string | null;
}

const STORAGE_KEY = "distrim_unlocked_stamps";

export function loadStampsFromStorage(): Stamp[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Stamp[];
  } catch {
    return [];
  }
}

export function saveStampToStorage(stamp: Stamp) {
  const current = loadStampsFromStorage();
  const exists = current.some((s) => s.totem_id === stamp.totem_id);
  if (exists) return;
  const updated = [...current, stamp];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

const StampBar = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [stamps, setStamps] = useState<Stamp[]>([]);

  useEffect(() => {
    const load = async () => {
      if (isLoading) return;

      if (isAuthenticated && user?.sub) {
        // luăm toate totemele deblocate pentru userul curent
        const { data, error } = await supabase
          .from("totem_unlocks")
          .select("totem_id, totems ( stamp_label, stamp_emoji )")
          .eq("auth0_sub", user.sub);

        if (error) {
          console.error("Eroare la încărcarea ștampilelor:", error);
          setStamps([]);
          return;
        }

        const mapped: Stamp[] =
          (data || []).map((row: any) => ({
            totem_id: row.totem_id,
            stamp_label: row.totems?.stamp_label ?? "Totem",
            stamp_emoji: row.totems?.stamp_emoji ?? "🏙️",
          })) ?? [];

        setStamps(mapped);
      } else {
        // guest: folosim doar localStorage
        setStamps(loadStampsFromStorage());
      }
    };

    load();
  }, [isAuthenticated, isLoading, user?.sub]);

  if (!stamps.length) return null;

  return (
    <div className="w-full bg-background/90 border-b border-border/60">
      <div className="container max-w-4xl mx-auto px-4 py-2 flex items-center gap-2 text-xs overflow-x-auto">
        <span className="font-medium text-muted-foreground whitespace-nowrap">
          Ștampile colectate:
        </span>
        <div className="flex flex-nowrap gap-2">
          {stamps.map((s) => (
            <span
              key={s.totem_id}
              className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2 py-1 bg-card"
            >
              <span>{s.stamp_emoji || "🏙️"}</span>
              <span className="whitespace-nowrap">{s.stamp_label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StampBar;
