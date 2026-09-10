import { QdrantVectorStore } from "@langchain/qdrant";
import { embeddings } from "./Embeddings.js";

export const vectorStore = async () => {
    return await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: process.env.QDRANT_URL,
        collectionName: "langchainjs-testing",
        apiKey:process.env.QDRANT_API_KEY
    });
}