import axios from "axios";
import { getModel } from "../config/LLMmodels.js";
import { uploadToS3 } from "../utils/uploadS3.js";
import { GetFromS3 } from "../utils/getFromS3.js";
import { deductCredits } from "../utils/DeductCredits.js";
import { rateLimiter } from "../utils/ratelimiter.js";

export const imageAgent = async (state) => {
  try {
        await rateLimiter(state.userId,"image")
    
    console.log("image agent started");
    const PromptEnhaceLLm = await getModel("image");

    // 1. Elite Prompt Engineering System Prompt (strictly requesting plain text string)
    const systemPrompt = `
You are an Elite Image Generation Prompt Engineer. Your task is to take a simple, raw user prompt and enhance it into an ultra-detailed, professional image generation prompt optimized for tools like Midjourney v6, Flux, and DALL-E 3.

Enhance the input by expanding across these 6 visual dimensions:
1. Subject & Action: Specific poses, micro-expressions, clothing textures, focal points.
2. Lighting & Mood: Volumetric rays, cinematic chiaroscuro, golden hour, neon rim lighting, subsurface scattering.
3. Camera & Lens: Focal length (e.g., 85mm prime, 24mm wide-angle), depth of field (f/1.4, f/11), angle (low-angle, overhead drone), shutter speed.
4. Composition: Rule of thirds, golden ratio, dynamic symmetry, depth layering (foreground, midground, background).
5. Style & Texture: Photorealistic, 8K, Octane Render, unreal engine 5 render, fine tactile details (pores, metallic grain, fabric weaves).
6. Color Palette: Cinematic color grading, teal and orange, monochrome with splash color, warm muted tones.

STRICT FORMAT REQUIREMENTS:
- Output ONLY the enhanced prompt as a single, plain text paragraph.
- Do NOT use Markdown formatting, code fences (no \`\`\`), or quotes.
- Do NOT include conversational filler, greetings, or intro text.`;

    // 2. Call the LLM
    const response = await PromptEnhaceLLm.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: state.prompt },
    ]);

    await deductCredits(state.userId, "image")


    // 3. Extract the clean plain-text string directly without Markdown parsing
    const enhancedPrompt = (
      typeof response === "string" ? response : response.content
    ).trim();

    console.log(enhancedPrompt);

    const ImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}`;

    const imageResponse = await axios.get(ImageUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(imageResponse.data);

    const filename = `images/${Date.now()}.png`;

    await uploadToS3("image/png", filename, buffer);
    const downloadURL = await GetFromS3(filename, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `![Generated Image](${downloadURL})\n\n[📥 **Download High-Res Image**](${downloadURL}) *(Link expires in 24 hours)*`,
    };
  } catch (error) {
    console.error("Error in imageAgent:", error);
    return {
      ...state,
      aiResponse:
        "⚠️ **Error:** I encountered an issue while generating your image. Please try again.",
    };
  }
};