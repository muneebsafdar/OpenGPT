import express from "express";
import "dotenv/config";
import conn from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

import cors from "cors";

const app = express();


app.use(express.json());

app.use("/", authRoutes);

app.get("/health", (req, res) => {
  res.json({ message: `Auth Service is running on port ${process.env.PORT}` });
});

// ── Start ───────────────────────────────────────────────────────────────────
app.listen(process.env.PORT, () => {
  conn();
  console.log(`Auth Service is running on port ${process.env.PORT}`);
});