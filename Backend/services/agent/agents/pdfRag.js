import fs from "fs";
import { createRequire } from "module";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { vectorStore } from "../config/Qdrant.js";
import { getModel } from "../config/LLMmodels.js";
import { rateLimiter } from "../utils/ratelimiter.js";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

export const pdfRagAgent = async (state) => {
      await rateLimiter(state.userId,"pdf")
  
  console.log("pdfrag started");
  const filePath = state.file?.path;
  const userQuery = state.prompt || state.query || "Summarize the key information from this document.";

  try {
    const qdrantStore = await vectorStore();

    // 1. Process and index PDF file if provided in request
    if (filePath && fs.existsSync(filePath)) {
      const pdfBuffer = fs.readFileSync(filePath);

      // Parse PDF buffer using CommonJS pdf-parse (v1.1.1 function API)
      const pdfData = await pdfParse(pdfBuffer);
      const extractedText = pdfData?.text || "";

      console.log(`Extracted text length: ${extractedText.length}`);

      if (extractedText.trim().length > 0) {
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 1000,
          chunkOverlap: 200,
        });

        const metadata = {
          userId: state.userId || "anonymous",
          filename: state.file?.originalname || "document.pdf",
          totalPages: pdfData.numpages || 1,
        };

        const docs = await textSplitter.createDocuments([extractedText], [metadata]);
        await qdrantStore.addDocuments(docs);
        console.log(`Successfully stored ${docs.length} chunks in Qdrant.`);
      } else {
        console.warn("⚠️ Warning: Could not extract text from PDF. It may be empty or scanned image-based.");
      }
    }

    // 2. Perform similarity search in Qdrant
    const searchResults = await qdrantStore.similaritySearch(userQuery, 4);

    if (!searchResults || searchResults.length === 0) {
      return {
        ...state,
        aiResponse: "⚠️ **No Relevant Content Found:** Could not retrieve matching context from the vector storage.",
      };
    }

    // 3. Format retrieved context
    const contextText = searchResults
      .map((doc) => doc.pageContent)
      .join("\n\n");

    // 4. Retrieve LLM Model instance
    const llm = await getModel("pdfRagAgent");

    // 5. System Prompt
    const systemPrompt = `You are an expert AI assistant specializing in document analysis and retrieval-augmented generation (RAG).
Your goal is to answer user questions accurately based strictly on the provided context.

CRITICAL GUIDELINES:
- **Strict Grounding:** Answer using ONLY the factual context provided below. Do NOT extrapolate, speculate, or draw on outside knowledge.
- **Handling Missing Information:** If the context does not contain sufficient details to answer the user's question, clearly state: "I couldn't find the answer to your question in the provided document."
- **Formatting:** Use clean structural elements like bold headings, bullet points, or numbered lists to make responses scannable.
- **Tone:** Direct, objective, and professional.`;

    // 6. Assemble LangChain messages
    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(`Context:\n${contextText}\n\nUser Question:\n${userQuery}`),
    ];

    // 7. Invoke Model
    const response = await llm.invoke(messages);

    return {
      ...state,
      aiResponse: typeof response === "string" ? response : response.content,
    };
  } catch (error) {
    console.error("Error in pdfRagAgent:", error);
    return {
      ...state,
      aiResponse: "⚠️ **Error:** An error occurred while parsing, indexing, or generating the PDF response.",
    };
  } finally {
    // 8. File Cleanup
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up temp PDF file: ${filePath}`);
      } catch (unlinkErr) {
        console.error(`Failed to delete temp PDF (${filePath}):`, unlinkErr);
      }
    }
  }
};