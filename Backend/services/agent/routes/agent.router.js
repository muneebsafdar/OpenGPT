
import { Router } from "express";
import { chatAgentController } from "../controllers/agent.controller.js";
import upload from "../utils/multer.js";

const router = Router();

router.post("/chat",upload.single("file"),chatAgentController);

export default router;