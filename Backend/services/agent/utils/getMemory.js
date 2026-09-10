import redis from "../../../shared/redis/redis.js";
import { getMessages } from "../services/agent.service.js";

export const getMemory = async (conversationId) => {
    try {
        const memory = await redis.get(`chat:${conversationId}`);
        if (memory) {
            
            return JSON.parse(memory);
        }

        const messages = await getMessages(conversationId);

        console.log(messages);
        if (messages) {
            await redis.set(`chat:${conversationId}`, JSON.stringify(messages), "EX", 3600);
        }

        return messages;
    } catch (error) {
        throw error;
    }
};

export const addMessage = async (conversationId, role, content) => {
    let messages = [];

    try {
        const existingMessages = await redis.get(`chat:${conversationId}`);
        if (existingMessages) {
            const parsed = JSON.parse(existingMessages);
            // Ensure parsed value is actually an array
            messages = Array.isArray(parsed) ? parsed : [];
        }
    } catch (error) {
        console.error("Error getting messages from redis", error);
    }
    
    // 1. Add new message
    messages.push({ role, content });

    // 2. Keep only the last 20 messages
    if (messages.length > 20) {
        messages = messages.slice(-20);

    }

    try {
        await redis.set(`chat:${conversationId}`, JSON.stringify(messages), "EX", 3600);
    } catch (error) {
        console.error("Error setting messages to redis", error);
    }

    // 3. Return updated messages array
    return messages;
};