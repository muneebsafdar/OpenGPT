import express from "express";
import "dotenv/config";
import conn from "./config/db.js";
import cors from "cors";
import router from "./routtes/billing.routes.js";
import { stripeWebhook } from "./controllers/billing.controller.js";

const app = express();



app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);


app.use(express.json());

app.use("/",router)

app.get("/health", (req, res) => {
  res.json({ message: `Billing Service is running on port ${process.env.PORT}` });
});


// ── Start ───────────────────────────────────────────────────────────────────
app.listen(process.env.PORT, () => {
  conn();
  console.log(`Billing Service is running on port ${process.env.PORT}`);
});