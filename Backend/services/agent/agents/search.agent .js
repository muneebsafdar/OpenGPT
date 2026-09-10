import { Searchtool } from "../config/tavily.js"
import { deductCredits } from "../utils/DeductCredits.js";
import { rateLimiter } from "../utils/ratelimiter.js";

export const searchAgent = async(state) =>{
        await rateLimiter(state.userId,"search")
    

    console.log("search agent called")
   
    try {
        const result = await Searchtool.invoke({query:state.prompt})
        await deductCredits(state.userId, "search")
        return {
            ...state,
            searchResult:result,
            images:result.images
        }
    }catch(error){
        console.log(error)
        return{
             ...state,
            searchResult:[],
            images:[],
        }
    }
}