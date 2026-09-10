import axios from "axios";

export const chatAgentService = async (role,content, conversationId,images,artifacts) => {
    await axios.post(`${process.env.CHAT_SERVICE_URL}/messages`, {
        role,
        content,
        conversationId,
        images,
        artifacts
    });

    
};


export const getMessages = async (conversationId) => {
  try {
    console.log("conversationId:", conversationId);

    const response = await axios.get(process.env.CHAT_SERVICE_URL+"/messages", {
      params: {
        conversationId: conversationId,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
