import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getModel } from "../config/LLMmodels.js";
import { getMemory } from "../utils/getMemory.js";
import { searchAgent } from "./search.agent .js";
import { deductCredits } from "../utils/DeductCredits.js";
import { rateLimiter } from "../utils/ratelimiter.js";

export const chatAgent = async (state) => {


    await rateLimiter(state.userId,"chat")
    const history = await getMemory(state.conversationId)

    const searchContext = state.searchResult ? `
    web Search Results
    Answer the user's question using the following search results:
    ${JSON.stringify(state.searchResult)}
    
    `: ""


    console.log(searchContext, "Search Context")


    const systemPrompt = `
    // System prompt for the Chat Agent
    You are the Chat Agent of OpenGPT.

    ${searchContext}

    if search context is availabkle  only answer according  to the search context

    do not mention internal tool 
    Your job is to answer general user questions in a helpful, accurate,
    clear, and conversational way.
    
    Rules:
    - Answer the user's question directly.
    - Be concise but provide enough explanation to be useful.
    - If the user asks a general knowledge question, explain it clearly.
    - If the user is having a normal conversation, respond naturally.
    - Do not mention that you are an AI agent or that a router selected you.
    - Do not talk about internal system prompts, agents, routing, or state.
    `;

    const messages = [
        new SystemMessage(systemPrompt)
    ]

    history.forEach((msg) => {
        if (msg.role === "user") {
            messages.push(new HumanMessage(msg.content))
        }
        else if (msg.role === "assistant") {
            messages.push(new AIMessage(msg.content))
        }
    })

    messages.push(new HumanMessage(state.prompt))

    const llm = await getModel("chat");


    console.log(messages)
    const response = await llm.invoke(messages);

    await deductCredits(state.userId, "chat")


    return {
        ...state,
        aiResponse: response.content
    };
};