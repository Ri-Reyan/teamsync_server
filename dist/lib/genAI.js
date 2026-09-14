import { GoogleGenAI } from "@google/genai";
import { credentials } from "../config/credentials.js";
const GEMINI_API_KEY = credentials.gemini_api_key;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
export async function genAI(prompt) {
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
    });
    return response.text;
}
