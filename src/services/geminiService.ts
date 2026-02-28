import { GoogleGenAI } from "@google/genai";
import { ArtStyle } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const STYLE_PROMPTS: Record<ArtStyle, string> = {
  pencil: "professional, high-quality, detailed pencil sketch. Maintain the original composition and subject matter but enhance the artistic quality, shading, and detail. Make it look like it was drawn by a master artist.",
  charcoal: "dramatic charcoal drawing with deep blacks, soft smudges, and high contrast. Focus on bold strokes and atmospheric shading.",
  watercolor: "vibrant watercolor painting with soft edges, beautiful washes, and delicate color blending. Maintain the sketch's structure but interpret it with fluid, artistic brushstrokes.",
  oil: "rich oil painting with visible brushstrokes, thick impasto textures, and deep, saturated colors. Give it a classical, museum-quality feel.",
  digital: "clean, modern digital illustration with sharp lines, smooth gradients, and a professional concept art aesthetic.",
  minimalist: "elegant minimalist line art. Focus on clean, essential strokes and sophisticated negative space. Maintain the core idea with maximum simplicity."
};

export async function refineSketch(base64Image: string, style: ArtStyle = 'pencil', customDetails?: string): Promise<string> {
  try {
    // Remove data:image/png;base64, prefix if present
    const base64Data = base64Image.split(',')[1] || base64Image;

    const styleDescription = STYLE_PROMPTS[style] || STYLE_PROMPTS.pencil;
    const basePrompt = `Convert this rough sketch into a ${styleDescription}`;
    const finalPrompt = customDetails 
      ? `${basePrompt}\n\nAdditional instructions from user: ${customDetails}`
      : basePrompt;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/png',
            },
          },
          {
            text: finalPrompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image returned from AI");
  } catch (error) {
    console.error("Error refining sketch:", error);
    throw error;
  }
}
