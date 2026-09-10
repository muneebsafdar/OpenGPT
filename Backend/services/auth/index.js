import express from "express";
import "dotenv/config";
import conn from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 8001;
const NODE_ENV = process.env.NODE_ENV || "development";

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/", authRoutes);

// ── Health Check ────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  console.log(`[HEALTH] Auth service health check received`);

  res.status(200).json({
    status: "ok",
    service: "auth-service",
    port: PORT,
    environment: NODE_ENV,
  });
});

// ── Error Handler ───────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[ERROR] Unhandled Express error:");
  console.error(err);

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

// ── Start Server ────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    console.log("────────────────────────────────────────");
    console.log("[STARTUP] Starting Auth Service...");
    console.log(`[STARTUP] Environment: ${NODE_ENV}`);
    console.log(`[STARTUP] Port: ${PORT}`);

    // Connect to MongoDB
    console.log("[DB] Connecting to MongoDB...");
    await conn();
    console.log("[DB] MongoDB connected successfully");

    // Start HTTP server
    app.listen(PORT, "0.0.0.0", () => {
      console.log("────────────────────────────────────────");
      console.log("[SERVER] Auth Service started successfully");
      console.log(`[SERVER] Port: ${PORT}`);
      console.log(`[SERVER] Environment: ${NODE_ENV}`);
      console.log("[SERVER] Host: 0.0.0.0");
      console.log("[SERVER] Health: /health");
      console.log("────────────────────────────────────────");
    });
  } catch (error) {
    console.error("────────────────────────────────────────");
    console.error("[FATAL] Auth Service failed to start");
    console.error("[FATAL] Error:", error);
    console.error("────────────────────────────────────────");

    process.exit(1);
  }
};

// ── Process Error Handling ──────────────────────────────────────────────────
process.on("uncaughtException", (error) => {
  console.error("[FATAL] Uncaught Exception:");
  console.error(error);

  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] Unhandled Promise Rejection:");
  console.error(reason);

  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("[SHUTDOWN] SIGTERM received. Shutting down Auth Service...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("[SHUTDOWN] SIGINT received. Shutting down Auth Service...");
  process.exit(0);
});

// ── Start ───────────────────────────────────────────────────────────────────
startServer();