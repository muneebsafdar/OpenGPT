import { getModel } from "../config/LLMmodels.js";
import { uploadToS3 } from "../utils/uploadS3.js";
import { GetFromS3 } from "../utils/getFromS3.js";
import { generatePPT } from "../utils/generatePPT.js";
import { deductCredits } from "../utils/DeductCredits.js";
import { rateLimiter } from "../utils/ratelimiter.js";

export const pptAgent = async (state) => {
      await rateLimiter(state.userId,"ppt")
  
  try {
    console.log("ppt agent started");
    const pptLLm = await getModel("ppt");

    // 1. System Prompt forcing strict JSON structure
    const systemPrompt = `
You are an expert presentation designer and content strategist for OpenGPT.
Your task is to convert user requests into a structured slide presentation deck.

STRICT OUTPUT FORMAT:
You MUST respond with ONLY a valid, raw JSON object (no Markdown backticks, no \`\`\`json code blocks, no introductory text).

The JSON structure MUST follow this exact schema:
{
  "title": "Main Presentation Title",
  "subtitle": "A concise subtitle or summary line",
  "slides": [
    {
      "title": "Slide Title",
      "points": [
        "First key bullet point expanding on the topic.",
        "Second bullet point with actionable detail.",
        "Third bullet point summarizing key takeaway."
      ]
    }
  ]
}`;

    // 2. Call the LLM
    const response = await pptLLm.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: state.prompt },
    ]);

    await deductCredits(state.userId, "ppt")


    // 3. Extract and parse clean JSON output
    const rawContent = (
      typeof response === "string" ? response : response.content
    ).trim();

    // Strip markdown code fences if LLM accidentally includes them
    const jsonString = rawContent.replace(/^```json\s*|^```\s*|\s*```$/g, "");
    const pptData = JSON.parse(jsonString);

    // 4. Generate PPT Buffer using PptxGenJS utility
    const buffer = await generatePPT(pptData);

    // 5. Upload to S3 & get Presigned Download URL
    const filename = `ppts/${Date.now()}.pptx`;
    await uploadToS3(
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      filename,
      buffer
    );
    const downloadURL = await GetFromS3(filename, 24 * 60 * 60);

    // 6. Return Markdown Response
    return {
      ...state,
      aiResponse: `📊 **${pptData.title}**\n*${pptData.subtitle}*\n\n[📥 **Download PowerPoint Presentation (.pptx)**](${downloadURL}) *(Link expires in 24 hours)*`,
    };
  } catch (error) {
    console.error("Error in pptAgent:", error);
    return {
      ...state,
      aiResponse:
        "⚠️ **Error:** I encountered an issue while generating your PowerPoint presentation. Please try again.",
    };
  }
};