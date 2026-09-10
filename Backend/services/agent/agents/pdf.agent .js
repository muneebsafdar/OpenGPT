import { getModel } from "../config/LLMmodels.js";
import { uploadToS3 } from "../utils/uploadS3.js";
import { GetFromS3 } from "../utils/getFromS3.js";
import { generatePDF } from "../utils/generatePDF.js";
import { deductCredits } from "../utils/DeductCredits.js";
import { rateLimiter } from "../utils/ratelimiter.js";

/**
 * Robust JSON parser that handles unquoted keys, single quotes, 
 * trailing commas, and unescaped line breaks.
 */
const safeJsonParse = (text) => {
  if (!text) throw new Error("Empty model output.");

  // 1. Strip markdown fences and find JSON boundaries
  let clean = text.replace(/```json\s*|```\s*/gi, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");

  if (start === -1 || end === -1 || end < start) {
    throw new Error("No JSON object found in model response.");
  }

  clean = clean.slice(start, end + 1);

  // 2. Try standard parse first
  try {
    return JSON.parse(clean);
  } catch (e) {
    // Continue to repair steps if standard parse fails
  }

  // 3. Repair Step A: Convert single-quoted keys/strings to double-quoted
  clean = clean.replace(/'([^'\\]*(\\.[^'\\]*)*)'/g, '"$1"');

  // 4. Repair Step B: Fix unquoted property keys ({ title: -> { "title":)
  clean = clean.replace(/([{,]\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$2":');

  // 5. Repair Step C: Remove trailing commas before closing brackets/braces
  clean = clean.replace(/,\s*([}\]])/g, "$1");

  // 6. Repair Step D: Escape raw line breaks inside string values
  clean = clean.replace(/[\u0000-\u001F\u007F-\u009F]/g, (char) => {
    if (char === "\n") return "\\n";
    if (char === "\r") return "\\r";
    if (char === "\t") return "\\t";
    return "";
  });

  return JSON.parse(clean);
};

export const pdfAgent = async (state) => {
  await rateLimiter(state.userId, "pdf");

  try {
    console.log("pdf agent started");
    let pdfLLm = await getModel("pdf");

    // Attempt to enforce JSON mode on supporting providers
    if (typeof pdfLLm.bind === "function") {
      try {
        pdfLLm = pdfLLm.bind({ response_format: { type: "json_object" } });
      } catch (e) {
        // Fallback silently if unsupported
      }
    }

    const systemPrompt = `
You are an expert technical writer for OpenGPT.
Convert the user prompt into a structured document JSON.

CRITICAL REQUIREMENT:
You MUST use valid JSON syntax. Every key and string value MUST be wrapped in double quotes (").

JSON SCHEMA:
{
  "title": "Main Document Title",
  "subtitle": "A concise subtitle or summary line",
  "sections": [
    {
      "heading": "Section Heading Title",
      "points": [
        "First key point with detailed explanation.",
        "Second key point expanding further on the concept."
      ]
    }
  ]
}`;

    const response = await pdfLLm.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: state.prompt },
    ]);

    const rawContent = (
      typeof response === "string" ? response : response.content
    ).trim();

    // Safely parse JSON with multi-stage fallback
    const pdfData = safeJsonParse(rawContent);

    // Deduct credits only after valid parse
    await deductCredits(state.userId, "pdf");

    // Generate PDF & upload to S3
    const buffer = await generatePDF(pdfData);
    const filename = `pdfs/${Date.now()}.pdf`;
    await uploadToS3("application/pdf", filename, buffer);
    const downloadURL = await GetFromS3(filename, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `📄 **${pdfData.title}**\n*${pdfData.subtitle}*\n\n[📥 **Download PDF Document**](${downloadURL}) *(Link expires in 24 hours)*`,
    };
  } catch (error) {
    console.error("Error in pdfAgent:", error);
    return {
      ...state,
      aiResponse:
        "⚠️ **Error:** I encountered an issue while generating your PDF document. Please try again.",
    };
  }
};