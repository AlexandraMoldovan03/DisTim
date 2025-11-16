// src/components/TimisoaraStory.tsx
import { useState } from "react";
import { generateTimisoaraStory } from "@/lib/gemini";
import { fetchVisitedPlacesForStory } from "@/lib/passportSupabase";
import { useAuth } from "@/contexts/AuthContext";

const ALL_PLACES_FALLBACK = [
  "Piața Unirii",
  "Catedrala Mitropolitană",
  "Podul Decebal",
  "Piața Victoriei",
  "Opera Română",
  "Gara de Nord",
];

// fallback local, în caz că TOTUL crapă
function buildLocalFallback(places: string[]): string {
  const lista = places.map((p) => `• ${p}`).join("\n");

  return (
    `Seara cobora peste Timișoara, iar pașii tăi te-au purtat printre lumini calde ` +
    `și clădiri încărcate de istorie. De-a lungul drumului ai trecut pe la:\n\n` +
    `${lista}\n\n` +
    `Chiar dacă povestea generată automat nu a fost disponibilă acum, orașul continuă ` +
    `să-ți ofere un arc de momente, culori și emoții.\n` +
    `Data viitoare, povestea ta va fi și mai bogată – pentru că Timișoara știe întotdeauna să surprindă.`
  );
}

export default function TimisoaraStory() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState("");
  const [usedFallback, setUsedFallback] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setStory("");
    setUsedFallback(false);

    // id-ul pe care îl folosim pentru Supabase (sau demo-user)
    const rawUserId =
      (user as any)?.id ||
      (user as any)?.sub ||
      "demo-user";

    const userId = String(rawUserId);

    let visitedPlaces: string[] = [];
    try {
      visitedPlaces = await fetchVisitedPlacesForStory(userId);
    } catch (e) {
      console.error("Eroare la fetchVisitedPlacesForStory:", e);
      visitedPlaces = [];
    }

    const placesForStory =
      visitedPlaces.length > 0 ? visitedPlaces : ALL_PLACES_FALLBACK;

    if (!visitedPlaces.length) {
      setUsedFallback(true);
    }

    try {
      // 1) încercăm să luăm povestea de la Gemini
      const textFromApi = await generateTimisoaraStory(placesForStory);

      // 2) dacă API-ul a întors ceva gol, folosim fallback local
      const finalText =
        textFromApi && textFromApi.trim().length > 0
          ? textFromApi
          : buildLocalFallback(placesForStory);

      setStory(finalText);
    } catch (err) {
      // 3) dacă TOTUȘI explodează ceva, NU mai arătăm mesaj roșu,
      // ci direct poveste fallback locală
      console.error(
        "[TimisoaraStory] Eroare la generateTimisoaraStory, folosim fallback local:",
        err
      );
      setStory(buildLocalFallback(placesForStory));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-3">
        Povestea ta prin Timișoara
      </h2>
      <p className="text-sm text-slate-300 mb-4">
        Gemini construiește o poveste scurtă, cinematică, bazată pe locurile
        pe care le-ai descoperit prin totem-urile DisTim.
      </p>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="rounded-full bg-cyan-500 px-6 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {loading ? "Generăm povestea..." : "Generează povestea mea"}
      </button>

      {usedFallback && (
        <p className="mt-3 text-xs text-amber-300/80">
          Folosim locuri implicite pentru că nu ai scanat încă totem-uri.
        </p>
      )}

      {story && (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm leading-relaxed whitespace-pre-wrap">
          {story}
        </div>
      )}

      {loading && !story && (
        <p className="mt-4 text-sm text-slate-400">
          Se conectează la Gemini și construiește povestea ta…
        </p>
      )}
    </div>
  );
}
