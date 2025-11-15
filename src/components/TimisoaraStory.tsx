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

export default function TimisoaraStory() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setStory("");
    setUsedFallback(false);

    if (!user) {
      setError(
        "Trebuie să fii autentificat ca să îți generăm povestea personalizată."
      );
      setLoading(false);
      return;
    }

    const userId = user.id as string;

    let visitedPlaces: string[] = [];
    try {
      visitedPlaces = await fetchVisitedPlacesForStory(userId);
    } catch (e) {
      console.error(e);
    }

    const placesForStory =
      visitedPlaces.length > 0 ? visitedPlaces : ALL_PLACES_FALLBACK;

    if (!visitedPlaces.length) {
      setUsedFallback(true);
    }

    try {
      const text = await generateTimisoaraStory(placesForStory);
      setStory(text);
    } catch (err) {
      console.error(err);
      setError(
        "A apărut o eroare când am încercat să generăm povestea. Încearcă din nou mai târziu."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">
        Povestea ta prin Timișoara
      </h2>
      <p className="text-sm text-slate-400 mb-4">
        Gemini construiește o poveste scurtă, cinematică, bazată pe locurile
        pe care le-ai descoperit prin totem-urile DisTim.
      </p>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="rounded-full bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
      >
        {loading ? "Generăm povestea..." : "Generează povestea mea"}
      </button>

      {usedFallback && !error && (
        <p className="mt-3 text-xs text-amber-300/80">
          Nu am găsit încă totem-uri marcate ca vizitate pentru contul tău, așa
          că am folosit toate punctele DisTim ca inspirație. Pe măsură ce scanezi
          QR-uri și deblochezi ștampile, povestea va deveni tot mai personală. ✨
        </p>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-400">
          {error}
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
