import { TavilySearch } from "@langchain/tavily";

export const Searchtool = new TavilySearch({
  maxResults: 5,
  topic: "general",
  includeImages: true,

});