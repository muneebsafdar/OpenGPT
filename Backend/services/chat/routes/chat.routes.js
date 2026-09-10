import { Router } from "express";
import {
  createConversation,
  getConversations,
  deleteConversation,
  updateConversation,
  createMessage,
  getMessages,
} from "../controllers/chat.controller.js";

const router = Router();

// Conversation routes
router.post("/conversation", createConversation);
router.get("/conversations", getConversations);
router.patch("/conversation", updateConversation);
router.delete("/conversation", deleteConversation);

// Message routes
router.post("/messages", createMessage);
router.get("/messages", getMessages);

export default router;