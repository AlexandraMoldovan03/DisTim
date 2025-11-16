// src/lib/gemini.ts
import { GoogleGenAI } from "@google/genai";
import { MODEL_NAME, TIMISOARA_PLACES } from "../constants";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

if (!apiKey) {
  console.error("❌ VITE_GEMINI_API_KEY is not set in .env.local");
}

const ai = new GoogleGenAI({
  apiKey: apiKey,
});

function buildFallbackStory(places: string[]): string {
  const list = places.join("\n• ");
  return (
    `Seara cobora peste Timișoara, iar pașii tăi te-au purtat printre lumini calde ` +
    `și clădiri încărcate de istorie. De-a lungul drumului ai trecut pe la:\n\n` +
    `• ${list}\n\n` +
    `Chiar dacă povestea generată automat nu a fost disponibilă acum, orașul ` +
    `continuă să-ți ofere un arc de momente, culori și emoții.\n` +
    `Data viitoare, povestea ta va fi și mai bogată – pentru că Timișoara ` +
    `știe întotdeauna să surprindă.`
  );
}

/**
 * Generează o mini poveste în funcție de locurile bifate.
 */
export async function generateTimisoaraStory(
  places: string[]
): Promise<string> {
  const safePlaces =
    Array.isArray(places) && places.length > 0
      ? places
      : [...TIMISOARA_PLACES];

  if (!apiKey) {
    // fără cheie → fallback local
    return buildFallbackStory(safePlaces);
  }

  const prompt = `
Scrie o mini poveste cinematografică, frumoasă și emoționantă, despre o plimbare prin Timișoara.
Punctele vizitate sunt:

${safePlaces.map((p) => `• ${p}`).join("\n")}

Povestea trebuie să aibă:
- 2-3 paragrafe
- ton cald, poetic, inspirațional
- detalii vizuale și atmosferă
- să fie legată de locurile reale
- să se termine cu o notă optimistă.

Scrie în limba română.
`.trim();

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    const text = response.text;

    if (!text || !text.trim()) {
      console.warn("[Gemini] Empty response, using fallback.");
      return buildFallbackStory(safePlaces);
    }

    return text.trim();
  } catch (err: any) {
    console.error("[Gemini] API error, using fallback:", err?.message || err);
    return buildFallbackStory(safePlaces);
  }
}
