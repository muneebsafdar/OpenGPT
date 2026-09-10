import api from "../utils/axios";

export const getMessages = async (conversationId) => {
  try {
    console.log("conversationId:", conversationId);

    const response = await api.get("api/v1/chat/messages", {
      params: {
        conversationId: conversationId,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};