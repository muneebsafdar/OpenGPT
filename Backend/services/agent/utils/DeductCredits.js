import axios from "axios";

export const deductCredits = async (userId,agent)=>{
    try {
        const response = await axios.post(`${process.env.AUTH_SERVICE_URL}/deduct-credits`,{
            userId,
            agent
        })
        return response.data
    } catch (error) {
        console.log(error)
        throw error
    }
}