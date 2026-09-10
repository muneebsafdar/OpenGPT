import api from "@/utils/axios";

export const createConversation = async () => {
    try {
        const res = await api.post("api/v1/chat/conversation");
        return res.data;
    } catch (error) {
        console.error("[Create Conversation] error:", error.message);
        return []
    }
};