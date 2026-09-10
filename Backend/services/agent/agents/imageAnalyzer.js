import fs from "fs";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { getModel } from "../config/LLMmodels.js";
import { rateLimiter } from "../utils/ratelimiter.js";

export const imageAnalyzer = async (state) => {

      await rateLimiter(state.userId,"image")
  

    console.log("image analyzer agent started")
  const filePath = state.file?.path;

  try {
    const llm = await getModel("imageAnalyzer");

    // 1. Read file and encode to Base64
    const imageBuffer = fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString("base64");
    const mimeType = state.file?.mimetype || "image/jpeg";

    // 2. Comprehensive System Prompt
    const systemPrompt = `You are an expert visual analysis engine for OpenGPT.
Your job is to thoroughly inspect, analyze, and interpret visual data provided in images.

ANALYSIS GUIDELINES:
- Visual Breakdown: Identify key subjects, objects, colors, background elements, and spatial layout.
- Text & OCR: If the image contains text, extract and transcribe it accurately.
- Context & Insights: Explain the significance, mood, or operational context of the visual content.
- Tone & Format: Respond clearly using bold headers, concise bullet points, and actionable summaries. Avoid vague or repetitive descriptions.`;

    // 3. User Prompt (fallback to default if prompt is empty)
    const userPrompt = state.prompt || "Analyze this image in detail and describe what you see.";

    // 4. Construct Multimodal Messages
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage({
        content: [
          { type: "text", text: userPrompt },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ],
      }),
    ];

    // 5. Call LLM
    const response = await llm.invoke(messages);

    // 6. Return updated state
    return {
      ...state,
      aiResponse: typeof response === "string" ? response : response.content,
    };
  } catch (error) {
    console.error("Error in imageAnalyzer:", error);
    return {
      ...state,
      aiResponse: "⚠️ **Error:** Failed to analyze the image. Please try uploading it again.",
    };
  } finally {
    // 7. Guaranteed File Cleanup
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Successfully deleted temp file: ${filePath}`);
      } catch (unlinkErr) {
        console.error(`Failed to delete temp file (${filePath}):`, unlinkErr);
      }
    }
  }
};