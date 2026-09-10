import { graph } from "../graph/graph.js";
import { chatAgentService } from "../services/agent.service.js";
import { addMessage } from "../utils/getMemory.js";

export const chatAgentController = async (req, res,next) => {
    try {
        const { prompt, conversationId, agent, mode } = req.body;
        const file = req.file; // Populated by multer
        const selectedAgent = agent || mode;
        const userId = req.headers["x-user-id"] || req.body?.userId;

        if (!conversationId) {
            return res.status(400).json({
                success: false,
                message: "ConversationId is required",
            });
        }

        if(prompt){
            await chatAgentService("user", prompt, conversationId);
            await addMessage(conversationId, "user", prompt);
        }   

        const response = await graph.invoke({
            prompt: prompt || "",
            conversationId,
            agent: selectedAgent,
            userId,
            file: file || null, // Fallback to null if no file uploaded
        });

        const finalResponse = response.aiResponse;
        await addMessage(conversationId, "assistant", finalResponse);

        await chatAgentService("assistant", finalResponse, conversationId, response.images, response?.artifacts);

        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data: finalResponse,
            images: response?.images,
            artifacts: response?.artifacts
        });
    } catch (error) {

        next(error)
    }
};