import api from "../utils/axios.js";

export const verifyPayment = async (sessionId) => {
  try {
    // Fixed: Changed api.post to api.get and using clean path parameter
    const response = await api.get(`/api/v1/billing/verify-session?sessionId=${sessionId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("[verifyPayment] error:", error);
    throw error;
  }
};