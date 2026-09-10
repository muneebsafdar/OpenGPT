import { Router } from "express";
import { deductCredits, login, logout, updateUserPayment } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/update-user", updateUserPayment);
router.post("/deduct-credits", deductCredits);

export default router;
