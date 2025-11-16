// src/pages/GeminiStoryPage.tsx
import { useState } from "react";
import { TIMISOARA_PLACES } from "../constants";
import { generateTimisoaraStory } from "../lib/gemini";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GeminiStoryPage() {
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function togglePlace(place: string) {
    setSelectedPlaces((current) =>
      current.includes(place)
        ? current.filter((p) => p !== place)
        : [...current, place]
    );
  }

  async function handleGenerate() {
    setLoading(true);
    setError("");
    setStory("");

    try {
      const result = await generateTimisoaraStory(selectedPlaces);
      setStory(result);
    } catch (e: any) {
      setError("A apărut o eroare la generarea poveștii.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] w-full bg-slate-950 text-slate-50 flex items-start justify-center px-4 py-8">
      <Card className="w-full max-w-2xl bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle>Mini poveste cu Gemini 🌙</CardTitle>
          <CardDescription>
            Alege locurile din Timișoara pe care „le-ai vizitat” și lasă AI-ul să-ți
            scrie o poveste cinematografică, ca un mic side-quest de unhack.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <p className="mb-2 text-sm text-slate-300">
              Bifează locurile prin care ai „hoinărit”:
            </p>
            <div className="space-y-1">
              {TIMISOARA_PLACES.map((place) => (
                <label
                  key={place}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-600 bg-slate-900"
                    checked={selectedPlaces.includes(place)}
                    onChange={() => togglePlace(place)}
                  />
                  <span>{place}</span>
                </label>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Generez povestea..." : "Generează mini poveste"}
          </Button>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          {story && (
            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-sm leading-relaxed whitespace-pre-wrap">
              {story}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
