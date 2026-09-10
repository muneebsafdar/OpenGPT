import api from "../utils/axios";

const getConversations = async () => {
    try {
        const res = await api.get("api/v1/chat/conversations");
        console.log(res.data)
        return res;
    } catch (error) {
        console.error("[Get Conversations] error:", error.message);
        return []
    }
};

export default getConversations;