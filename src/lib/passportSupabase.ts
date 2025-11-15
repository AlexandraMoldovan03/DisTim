// src/lib/passportSupabase.ts
import { supabase } from "@/lib/supabaseClient";

export type TotemId = string;



/**
 * Salvează o ștampilă pentru user în tabela user_stamps.
 * Folosim upsert ca să nu genereze eroare dacă există deja.
 */
export async function saveUserStamp(userId: string, totemId: TotemId) {
  if (!userId || !totemId) return;

  const { error } = await supabase
    .from("user_stamps")
    .upsert(
      { user_id: userId, totem_id: totemId },
      { onConflict: "user_id,totem_id" }
    );

  if (error) {
    console.error("Eroare la saveUserStamp:", error);
  }
}

/**
 * Ia din Supabase numele locurilor vizitate de user,
 * folosind join cu tabela totems (stamp_label).
 */
export async function fetchVisitedPlacesForStory(
  userId: string
): Promise<string[]> {
  if (!userId) return [];

  const { data, error } = await supabase
    .from("user_stamps")
    .select("totem_id, totems(stamp_label)")
    .eq("user_id", userId);

  if (error) {
    console.error("Eroare la fetchVisitedPlacesForStory:", error);
    return [];
  }

  // folosim any ca să nu ne mai certăm cu TS pe tipurile întoarse de Supabase
  const rows = (data ?? []) as any[];

  const labels = rows
    .map((row) => {
      const t = row.totems;
      // în unele setup-uri relația poate veni ca array, în altele ca obiect
      if (Array.isArray(t)) {
        return t[0]?.stamp_label || row.totem_id;
      }
      return t?.stamp_label || row.totem_id;
    })
    .filter((label: any) => Boolean(label)) as string[];

  // scoatem dublurile
  return Array.from(new Set(labels));
}
