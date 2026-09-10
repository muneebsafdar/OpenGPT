import api from "../utils/axios.js";

export const sendMessages = async (prompt, conversationId, mode, file) => {
  try {
    const formData = new FormData();
    formData.append("prompt", prompt || "");
    formData.append("conversationId", conversationId);
    
    if (mode) {
      formData.append("mode", mode);
    }
    
    if (file) {
      formData.append("file", file);
    }

    // Let Axios / Browser attach Content-Type automatically with boundary
    const response = await api.post(`/api/v1/agent/chat`, formData,);
    return response.data;
  } catch (error) {
    throw error;
  }
};