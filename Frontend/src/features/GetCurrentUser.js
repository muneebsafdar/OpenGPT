import api from "../utils/axios";

const getCurrentUser = async () => {
    try {
        const response = await api.get("/me");
        return response.data;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error;
    }
}

export default getCurrentUser