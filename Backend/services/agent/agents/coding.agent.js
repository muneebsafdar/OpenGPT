import { getModel } from "../config/LLMmodels.js";
import { deductCredits } from "../utils/DeductCredits.js";
import { rateLimiter } from "../utils/ratelimiter.js";

export const codingAgent = async (state) => {

        await rateLimiter(state.userId,"code")
    
    console.log("coding agent started");

    const userPrompt = state.prompt;

    // 1. Step 1: Detect intent using Groq model
    const classifierModel = await getModel("chat");

    const classificationSystemPrompt = `Analyze the user prompt and determine its intent.
Classify it into EXACTLY ONE of the following categories:
- code generation
- code review
- conversion
- documentation
- optimization

Return ONLY the category name in lowercase and nothing else.`;

    const intentResponse = await classifierModel.invoke([
        ["system", classificationSystemPrompt],
        ["user", userPrompt],
    ]);

    const intent = intentResponse.content.trim().toLowerCase();
    console.log("Detected Intent:", intent);

    // 2. Step 2: Handle "code generation" intent
    if (intent === "code generation") {
        // Get the coding model (OpenRouter / DeepSeek)
        const codeModel = await getModel("code");

        const codeGenSystemPrompt = `You are an expert full-stack developer and UI designer.
Generate full, functional code based on the user's request.

STRICT RULES:
1. Always generate separate HTML, CSS, and JS files (e.g., index.html, style.css, script.js) by default.
2. Build a single-page application/layout by default. Create multiple pages ONLY if explicitly requested by the user.
3. Ensure high-quality, modern, and beautiful CSS styling. Include responsive layouts, clean typography, appropriate spacing, smooth transitions, and a modern color palette.
4. Generate other tech stacks or frameworks (e.g., React, Python, Node.js, Tailwind) ONLY if the user explicitly requests them in the prompt.
5. Your output MUST be strictly valid JSON and nothing else. Do NOT include introductory text, explanations, or Markdown formatting outside the JSON structure.
6 . if there is need to put images in the html img tag you must use the unsplash images url for the images and never use placeholder 

REQUIRED JSON SCHEMA:
{
  "files": [
    {
      "name": "index.html",
      "content": "<!DOCTYPE html>..."
    },
    {
      "name": "style.css",
      "content": "/* Modern CSS styling */..."
    },
    {
      "name": "script.js",
      "content": "// JavaScript code..."
    }
  ]
}`;

        const codeResponse = await codeModel.invoke([
            ["system", codeGenSystemPrompt],
            ["user", userPrompt],
        ]);

        await deductCredits(state.userId, "code")


        let rawContent = codeResponse.content.trim();

        // Strip markdown backticks if the model wraps output in ```json ... ```
        if (rawContent.startsWith("```")) {
            rawContent = rawContent.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
        }




        try {
            const parsedData = JSON.parse(rawContent);
            return {
                ...state,
                aiResponse: "Code Generated Successfully",
                artifacts: {
                    id: Date.now().toString(),
                    type: "project",
                    files: parsedData.files || [],
                    title: state.prompt
                }
            };
        } catch (error) {
            console.error("Failed to parse JSON from LLM:", error);
            return {
                ...state,
                aiResponse: "Failed to Generate Code",
                artifacts: {
                    id: Date.now().toString(),
                    type: "project",
                    files: parsedData.files || [],
                    title: ""
                }
            };
        }
    }




    const analysisModel = await getModel("code");

    const analysisSystemPrompt = `
You are an expert software engineer, code reviewer, technical architect, and developer documentation specialist.

Your task is to analyze and respond to the user's request based on the detected intent:

"${intent}"

The user may ask for:
- Code review
- Code conversion or migration
- Code optimization
- Documentation
- Debugging or fixing code
- Refactoring
- Explanation of code
- Code generation
- Architecture or best-practice recommendations
- A combination of the above

GENERAL RULES:

1. Understand the user's actual request before responding.
2. Do not blindly follow a fixed response structure if it does not fit the user's request.
3. Adapt your response to the detected intent and provide only information that is relevant and useful.
4. Be technically precise and practical.
5. Prefer production-quality solutions over superficial suggestions.
6. When reviewing code, identify actual problems rather than inventing issues.
7. Explain WHY something is a problem and HOW it should be improved.
8. Consider readability, maintainability, scalability, performance, security, error handling, and industry best practices where relevant.
9. Do not unnecessarily rewrite working code.
10. Preserve the user's existing architecture and technology choices unless there is a strong technical reason to recommend a change.

CODE GENERATION RULE:

If the user's request requires code generation, modification, refactoring, conversion, or a concrete implementation:

- YOU MUST PROVIDE THE REQUIRED CODE.
- Do not only explain what the user should do.
- Provide complete and usable code whenever reasonably possible.
- If modifying existing code, clearly show the improved version.
- Keep the generated code consistent with the user's existing language, framework, libraries, and architecture.
- Do not generate project files or an entire project structure unless the user explicitly asks for them.
- If the user asks for a specific function, component, class, API, query, middleware, etc., provide the implementation directly.
- Do not omit important parts of the implementation with placeholders such as "// rest of code".

CODE REVIEW RULES:

When the intent is code review:

- Analyze correctness and potential bugs.
- Identify bad patterns, unnecessary complexity, and maintainability problems.
- Check error handling and edge cases.
- Check security concerns where applicable.
- Check performance issues where applicable.
- Check naming, structure, readability, and separation of concerns.
- Distinguish between critical issues and minor improvements.
- Provide corrected code when a concrete fix is useful.

CODE CONVERSION RULES:

When the intent is code conversion or migration:

- Understand the source code first.
- Preserve the original functionality.
- Convert it to the requested language, framework, library, or syntax.
- Explain important differences between the original and converted implementation.
- Highlight compatibility or behavioral changes.
- Provide the converted code.

OPTIMIZATION RULES:

When the intent is optimization:

- Identify the current bottleneck or inefficiency.
- Do not optimize code without explaining the reason.
- Consider time complexity, space complexity, database queries, network requests, rendering, memory usage, and unnecessary computation where applicable.
- Prefer measurable and meaningful optimizations over premature optimization.
- Provide optimized code when applicable.
- Explain the expected benefit of the optimization.

DOCUMENTATION RULES:

When the intent is documentation:

- Produce clear, developer-friendly documentation.
- Explain purpose, usage, parameters, return values, configuration, errors, and examples where applicable.
- Use Markdown formatting.
- Do not invent APIs, behavior, parameters, or features that are not supported by the provided code or context.

DEBUGGING RULES:

When debugging:

- Identify the likely root cause.
- Explain why the error occurs.
- Provide the exact fix when possible.
- If multiple causes are possible, rank them by likelihood.
- Provide corrected code when applicable.

RESPONSE FORMAT:

Your complete response MUST be valid JSON and NOTHING ELSE.

Do NOT:
- Add text outside the JSON.
- Use Markdown code fences around the JSON.
- Return JavaScript objects instead of JSON.
- Add comments outside the JSON.
- Return multiple JSON objects.

Use exactly this schema:

{
  "markdown": "Your complete response formatted as Markdown"
}

The value of "markdown" must contain the actual answer in Markdown.

MARKDOWN GUIDELINES:

Use Markdown naturally inside the "markdown" field.

Choose headings based on the user's request.

For code review, a useful structure may be:

## Overview

## Issues Found

## Explanation

## Recommended Changes

## Improved Code

## Best Practices

For code conversion:

## Overview

## Conversion

## Key Differences

## Converted Code

## Best Practices

For optimization:

## Overview

## Bottlenecks

## Optimization Strategy

## Optimized Code

## Expected Improvements

## Best Practices

For documentation:

## Overview

## Installation

## Usage

## API / Configuration

## Examples

## Notes

Do not include irrelevant sections just to satisfy a template.

IMPORTANT:

The user's intent is "${intent}".

Use that intent as guidance, but always prioritize the actual user's request and provided code/context over assumptions.
`;

    const analysisResponse = await analysisModel.invoke([
        ["system", analysisSystemPrompt],
        ["user", userPrompt],
    ]);

    await deductCredits(state.userId, "code")


    let rawAnalysis = analysisResponse.content.trim();


    if (rawAnalysis.startsWith("```")) {
        rawAnalysis = rawAnalysis.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    }

    try {
        const parsedAnalysis = JSON.parse(rawAnalysis);
        return {
            ...state,
            aiResponse: parsedAnalysis.markdown || rawAnalysis,
            artifacts: []
        };
    } catch (error) {
        console.error("Failed to parse analysis JSON from LLM:", error);
        return {
            ...state,
            aiResponse: rawAnalysis,
            artifacts: []
        };
    }

};