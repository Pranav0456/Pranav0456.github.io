import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function refineSketch(base64Image: string, customDetails?: string): Promise<string> {
  try {
    // Remove data:image/png;base64, prefix if present
    const base64Data = base64Image.split(',')[1] || base64Image;

    const basePrompt = "Convert this rough sketch into a professional, high-quality, detailed pencil sketch. Maintain the original composition and subject matter but enhance the artistic quality, shading, and detail. Make it look like it was drawn by a master artist.";
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
