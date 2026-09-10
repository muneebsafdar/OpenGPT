import express from "express";
import "dotenv/config";
import cors from "cors";
import conn from "./config/db.js";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

app.use(express.json());

app.use("/",chatRoutes)

app.get("/health", (req, res) => {
  res.json({ message: `Chat Service is running on port ${process.env.PORT}` });
});

// ── Start ───────────────────────────────────────────────────────────────────
app.listen(process.env.PORT, async () => {
  await conn();
  console.log(`Chat Service is running on port ${process.env.PORT}`);
});