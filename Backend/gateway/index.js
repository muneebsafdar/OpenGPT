import express from "express";
import "dotenv/config";
import proxy from 'express-http-proxy';
import authMiddleware from "./middlewares/auth.middleware.js";
import { getMe } from "./controllers/auth.controller.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleProxyWithUserId } from "./utils/ProxyWithHeaders.js";
import morgan from "morgan";

const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use("/api/v1/billing/webhook",proxy(process.env.BILLING_SERVICE_URL))
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(morgan("dev"))
app.use("/api/v1/auth",proxy(process.env.AUTH_SERVICE_URL))
app.use("/api/v1/chat",authMiddleware,handleProxyWithUserId(process.env.CHAT_SERVICE_URL))
app.use("/api/v1/agent",authMiddleware,handleProxyWithUserId(process.env.AGENT_SERVICE_URL))
app.use("/api/v1/billing",authMiddleware,handleProxyWithUserId(process.env.BILLING_SERVICE_URL))
app.get("/me",authMiddleware,getMe)

app.get("/",(req,res)=>{
    res.json({message:`Gateway now is running and healthy on port ${process.env.PORT} with frontedn url ${process.env.FRONTEND_URL}`})
})


app.listen(process.env.PORT,()=>{
    console.log(`Gateway is running on port ${process.env.PORT}`)
})