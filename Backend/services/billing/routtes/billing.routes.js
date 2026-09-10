import express from "express";
import { createOrder, verifySession } from "../controllers/billing.controller.js";

const router = express.Router();

router.post("/create-order", createOrder);

// Remove /:sessionId so it matches /verify-session?sessionId=...
router.get("/verify-session", verifySession);

export default router;