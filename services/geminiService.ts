import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateWallpapers(prompt: string, aspectRatio: AspectRatio): Promise<string[]> {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `${prompt}, phone wallpaper, high detail, 8k`,
      config: {
        numberOfImages: 4,
        outputMimeType: 'image/png',
        aspectRatio: aspectRatio,
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("API did not return any images.");
    }
    
    return response.generatedImages.map(img => {
        const base64ImageBytes: string = img.image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    });
    
  } catch (error) {
    console.error("Error generating images with Gemini:", error);
    throw new Error("Failed to generate wallpapers. The prompt may have been blocked or an API error occurred.");
  }
}
