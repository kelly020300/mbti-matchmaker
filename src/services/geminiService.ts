import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface CompatibilityResult {
  score: number;
  summary: string;
  strengths: string[];
  challenges: string[];
  advice: string;
}

export async function getMBTICompatibility(
  myMBTI: string,
  myGender: string,
  partnerMBTI: string,
  partnerGender: string
): Promise<CompatibilityResult> {
  const prompt = `
    Analyze the MBTI compatibility between two people:
    Person 1: MBTI: ${myMBTI}, Gender: ${myGender}
    Person 2: MBTI: ${partnerMBTI}, Gender: ${partnerGender}

    Provide a detailed compatibility analysis in Korean.
    The response must be in JSON format with the following structure:
    {
      "score": number (0-100),
      "summary": "A brief summary of the compatibility",
      "strengths": ["strength 1", "strength 2", ...],
      "challenges": ["challenge 1", "challenge 2", ...],
      "advice": "Advice for the relationship"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            challenges: { type: Type.ARRAY, items: { type: Type.STRING } },
            advice: { type: Type.STRING },
          },
          required: ["score", "summary", "strengths", "challenges", "advice"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    return JSON.parse(text) as CompatibilityResult;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
