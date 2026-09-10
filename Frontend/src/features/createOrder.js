import api from "../utils/axios.js"


export const createOrder = async (planName) => {
    try {
        const response = await api.post(
            "api/v1/billing/create-order",
            { planName },
            { withCredentials: true }
        );
        console.log(response)

        return response.data;
    } catch (error) {
        console.error("[createOrder] createOrder error:", error);
    }
}