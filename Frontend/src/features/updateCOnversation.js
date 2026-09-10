import api from "../utils/axios";

export const updateConversation = async (id, title) => {
  try {
    const response = await api.patch("api/v1/chat/conversation", {
      id,
      title,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};