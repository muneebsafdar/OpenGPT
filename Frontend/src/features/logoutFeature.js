import api from "@/utils/axios";

export const logoutFeature = async () => {
    const res = await api.post("/api/v1/auth/logout")
    return res.data
}