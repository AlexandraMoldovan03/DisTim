// src/components/StampBar.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
// 🔴 am scos: import { useAuth } from "@/contexts/AuthContext";

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

// funcție utilă: salvează în DB dacă user logat, altfel în localStorage
export async function saveStampForUserOrLocal(
  stamp: Stamp,
  userId: string | null
) {
  if (userId) {
    await supabase
      .from("user_stamps")
      .upsert(
        {
          user_id: userId,
          totem_id: stamp.totem_id,
        },
        { onConflict: "user_id,totem_id" }
      );
    // nu stocăm label/emoji în tabel, le luăm din join cu totems
  } else {
    saveStampToStorage(stamp);
  }
}

const StampBar = () => {
  // 🔴 temporar NU mai avem user – tratăm ca și cum ar fi mereu neautentificat
  const user = null;

  const [stamps, setStamps] = useState<Stamp[]>([]);

  useEffect(() => {
    const load = async () => {
      if (user) {
        // codul ăsta NU se va apela momentan, pentru că user = null
        const { data, error } = await supabase
          .from("user_stamps")
          .select("totem_id, totems ( stamp_label, stamp_emoji )");

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
        // ne bazăm DOAR pe localStorage
        setStamps(loadStampsFromStorage());
      }
    };

    load();
  }, [user]);

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
