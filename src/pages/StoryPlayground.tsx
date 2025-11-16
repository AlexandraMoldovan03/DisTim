// src/pages/StoryPlayground.tsx
import { useState, useCallback } from "react";
import { generateTimisoaraStory } from "@/lib/gemini";
import { Sparkles, BookOpen } from "lucide-react";

const StoryPlayground = () => {
  // locurile de pornire – poți schimba lista cum vrei
  const [placesInput, setPlacesInput] = useState(
    "Piața Unirii\nBastionul Theresia"
  );
  const [story, setStory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setStory("");

    // transformăm textarea în array de locuri
    const places = placesInput
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean);

    if (!places.length) {
      setError("Adaugă cel puțin un loc înainte să generezi povestea.");
      setIsLoading(false);
      return;
    }

    try {
      const text = await generateTimisoaraStory(places);
      setStory(text);
    } catch (err: any) {
      console.error("Eroare la generarea poveștii:", err);
      const msg =
        err?.message ??
        "A apărut o eroare neașteptată la generarea poveștii.";
      setError(`Eroare la generarea poveștii: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  }, [placesInput]);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0b1120] text-[#e5e7eb] flex flex-col items-center px-4 py-6">
      <main className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-2">
            <BookOpen className="h-8 w-8 text-cyan-400" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Generator de Povești pentru Timișoara
            </h1>
          </div>
          <p className="text-lg text-cyan-300/80 font-serif">
            Timișoara, prin ochii tăi și cuvintele lui Gemini.
          </p>
        </header>

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panou locuri */}
          <div className="bg-slate-900/70 p-6 rounded-2xl shadow-lg border border-slate-700/70">
            <h2 className="text-lg font-semibold mb-3">
              Locurile din poveste
            </h2>
            <p className="text-sm text-slate-300/80 mb-3">
              Scrie câte un loc pe fiecare linie. Gemini va construi
              povestea folosind exact aceste puncte din Timișoara.
            </p>

            <textarea
              value={placesInput}
              onChange={(e) => setPlacesInput(e.target.value)}
              rows={8}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
              spellCheck={false}
            />

            <div className="mt-6">
              <button
                onClick={handleGenerateStory}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-cyan-500 text-slate-950 font-semibold py-3 px-4 rounded-full shadow-md hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-slate-900 transition-all duration-300 disabled:bg-cyan-500/50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-slate-950"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2
                          5.291A7.962 7.962 0 014 12H0c0 3.042 1.135
                          5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Se generează povestea...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Generează povestea
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Panou poveste */}
          <div className="bg-slate-900/70 p-6 rounded-2xl shadow-lg border border-slate-700/70">
            <h2 className="text-lg font-semibold mb-3">Povestea generată</h2>

            {error && (
              <p className="text-sm text-red-400 mb-3">{error}</p>
            )}

            {!error && !story && !isLoading && (
              <p className="text-sm text-slate-300/80">
                Povestea ta va apărea aici după ce apeși butonul
                <span className="font-semibold"> „Generează povestea”</span>.
              </p>
            )}

            {story && (
              <div className="mt-2 rounded-xl bg-slate-950/60 border border-slate-700/80 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                {story}
              </div>
            )}

            {isLoading && (
              <p className="mt-3 text-sm text-slate-300/80">
                Gemini lucrează la povestea ta… ✨
              </p>
            )}
          </div>
        </div>

        <footer className="text-center mt-10 text-slate-400 text-xs">
          Creat cu React, Tailwind CSS și Gemini API.
        </footer>
      </main>
    </div>
  );
};

export default StoryPlayground;
