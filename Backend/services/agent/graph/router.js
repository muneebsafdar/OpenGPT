import { getModel } from "../config/LLMmodels.js";

export const router = async (state) => {

  
  if (state?.file?.mimetype === "application/pdf") {
    return {
      ...state,
      agent: "pdfRag"
    }
  }

  if (state?.file?.mimetype.startsWith("image/")) {
    return {
      ...state,
      agent: "imageAnalyzer"
    }
  }


  if (state.agent && state.agent !== "auto") {
    return {
      ...state,
      agent: state.agent
    }
  }




  const llm = await getModel("chat");

  const userQuestion =
    state.prompt;

  const prompt = `You are the Router Agent for OpenGPT.

Your job is ONLY to analyze the user's question and decide which specialized agent should handle it.

You MUST return ONLY ONE agent name.
Do NOT return explanations, punctuation, JSON, markdown, or any other text.

Available agents and their use cases:

* chat

  * General conversation
  * Greetings and casual questions
  * General knowledge
  * Explanations and discussions
  * Questions that do not clearly belong to another specialized agent

* code

  * Programming questions
  * Writing code
  * Debugging code
  * Fixing errors
  * Explaining programming concepts
  * Software architecture
  * APIs, databases, frameworks, libraries
  * React, Node.js, Express, Next.js, Python, C++, JavaScript, TypeScript, Docker, Git, etc.
  * If the user is asking to CREATE, FIX, MODIFY, or EXPLAIN CODE, choose code

* image

  * Image generation
  * Image editing
  * Creating visual designs
  * Creating diagrams, illustrations, logos, posters, or other images

* pdf

  * Creating a PDF
  * Reading or analyzing a PDF
  * Summarizing a PDF
  * Extracting information from a PDF
  * Asking questions about the contents of a PDF
  * Modifying or processing a PDF

* ppt

  * Creating PowerPoint presentations
  * Generating slides
  * Editing or modifying presentations
  * Analyzing PowerPoint files
  * Creating presentation content

* search

  * Questions requiring current or real-time information
  * Latest news
  * Current events
  * Current prices, rankings, or statistics
  * Recent information from the internet
  * Requests to search the web
  * Information that is likely to have changed recently

IMPORTANT ROUTING RULES:

1. Analyze the user's actual question, not just individual keywords.
2. Choose the most appropriate specialized agent.
3. If the user asks for coding or programming help, ALWAYS choose "code".
4. If the user asks to generate or edit an image, choose "image".
5. If the user asks about a PDF, choose "pdf".
6. If the user asks to create or analyze a PowerPoint, choose "ppt".
7. If the user explicitly needs current/latest/web information, choose "search".
8. If none of the specialized agents clearly apply, choose "chat".
9. Return ONLY the exact agent name.

Analyze the latest user message and return exactly one of:

chat
code
image
pdf
ppt
search


User question:
${userQuestion}`;

  const response = await llm.invoke(prompt);

  return {
    ...state,
    agent: response.content.trim().toLowerCase()
  };
};