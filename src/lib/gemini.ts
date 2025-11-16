// src/lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("⚠️ Lipsă cheia API pentru Google Gemini (VITE_GEMINI_API_KEY).");
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Generează o poveste cinematică despre Timișoara
 * pe baza locurilor vizitate.
 */
export async function generateTimisoaraStory(visitedPlaces: string[]) {
  if (!visitedPlaces || visitedPlaces.length === 0) {
    return "Nu ai vizitat încă niciun loc cultural din Timișoara.";
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const prompt = `
Creează o poveste scurtă, cinematică și atmosferică despre traseul unei persoane 
prin Timișoara, bazată pe aceste locuri vizitate:

${visitedPlaces.join(", ")}

Reguli:
- ton emoțional, cinematic, aproape poetic
- maximum 12–14 fraze
- include detalii senzoriale (sunete, lumini, atmosferă)
- nu transforma totul într-un eseu istoric, ci într-o experiență personală
- scrie în limba română
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Eroare la Gemini:", err);
    return "A apărut o eroare la generarea poveștii.";
  }
}
