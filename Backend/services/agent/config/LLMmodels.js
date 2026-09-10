import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter";

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: 1500,
    maxRetries: 2, 

})

const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash",
    temperature: 0,
    maxRetries: 2,
    maxOutputTokens:1500

})


const openRouter = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens: 2500,

});

export const getModel= async(agent)=>{

    if(agent==="search" || agent==="chat"|| agent==="image"||agent==="pdf" || agent==="ppt"){
        return groq
    }else if(agent==="code" ){
        return openRouter
    }else if(agent==="pdfRag" || agent==="imageAnalyzer"){
        return gemini
    }
    return groq
}