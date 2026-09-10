import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { router } from "./router.js";
import { chatAgent } from "../agents/chat.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { imageAgent } from "../agents/image.agent.js";
import { pdfAgent } from "../agents/pdf.agent .js";
import { pptAgent } from "../agents/ppt.agent .js";
import { searchAgent } from "../agents/search.agent .js";
import { pdfRagAgent } from "../agents/pdfRag.js";
import { imageAnalyzer } from "../agents/imageAnalyzer.js";

const workflow=new StateGraph(agentState)
     
workflow.addNode("router",router)
workflow.addNode("chat",chatAgent)
workflow.addNode("code",codingAgent)
workflow.addNode("image",imageAgent)
workflow.addNode("pdf",pdfAgent)
workflow.addNode("ppt",pptAgent)
workflow.addNode("search",searchAgent)
workflow.addNode("pdfRag",pdfRagAgent)
workflow.addNode("imageAnalyzer",imageAnalyzer)


workflow.addEdge("__start__","router")
workflow.addConditionalEdges("router",(state)=>{
    switch (state.agent) {
        case "chat":
            return "chat"
        case "code":
            return "code"
        case "image":
            return "image"
        case "pdf":
            return "pdf"
        case "ppt":
            return "ppt"    
        case "search":
            return "search"
        case "imageAnalyzer":
            return "imageAnalyzer"
        case "pdfRag":
            return "pdfRag"
        default:
            return "chat"
    }
},{
    chat:"chat",
    code:"code",
    image:"image",
    pdf:"pdf",
    ppt:"ppt",
    search:"search",
    imageAnalyzer:"imageAnalyzer",
    pdfRag:"pdfRag"
})


workflow.addEdge("search","chat")
workflow.addEdge("chat","__end__")
workflow.addEdge("code","__end__")
workflow.addEdge("image","__end__")
workflow.addEdge("pdf","__end__")
workflow.addEdge("ppt","__end__")
workflow.addEdge("pdfRag","__end__")
workflow.addEdge("imageAnalyzer","__end__")


export const graph = workflow.compile()