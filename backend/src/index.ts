import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { CONFIG } from "./config";

import authRoutes from "./routes/auth";
import issueRoutes from "./routes/issue";
import verifyRoutes from "./routes/verify";
import batchRoutes from "./routes/batch";
import adminRoutes from "./routes/admin";
import { databaseService } from "./services/database";

dotenv.config();

const app = express();

const parseEnvInt = (raw: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(raw || "", 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

const PORT = parseEnvInt(process.env.PORT, 3000);
let server: ReturnType<typeof app.listen> | null = null;
let isShuttingDown = false;

const closeHttpServer = async (): Promise<void> => {
  if (!server) {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    server?.close((error?: Error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
};

const gracefulShutdown = async (signal: NodeJS.Signals): Promise<void> => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`Received ${signal}. Starting graceful shutdown.`);

  try {
    await closeHttpServer();
    await databaseService.close();
    console.log("Graceful shutdown completed.");
    process.exit(0);
  } catch (error) {
    console.error("Graceful shutdown failed:", error);
    process.exit(1);
  }
};

process.on("SIGTERM", () => {
  void gracefulShutdown("SIGTERM");
});

process.on("SIGINT", () => {
  void gracefulShutdown("SIGINT");
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: CONFIG.allowedOrigins,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseEnvInt(process.env.RATE_LIMIT_WINDOW_MS, 900000), // 15 min
  max: parseEnvInt(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

const readinessLimiter = rateLimit({
  windowMs: parseEnvInt(process.env.READY_RATE_LIMIT_WINDOW_MS, 60000),
  max: parseEnvInt(process.env.READY_RATE_LIMIT_MAX_REQUESTS, 60),
  message: "Too many readiness checks from this IP, please try again later.",
});
app.use("/ready", readinessLimiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check (liveness)
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Readiness check (includes database)
app.get("/ready", async (req, res) => {
  try {
    await databaseService.ping();
    res.json({ status: "ok", database: "connected", timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: "error", database: "unavailable", timestamp: new Date().toISOString() });
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/issue", issueRoutes);
app.use("/api", verifyRoutes);
app.use("/api", batchRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(" Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const startServer = async (): Promise<void> => {
  try {
    await databaseService.initialize();

    server = app.listen(PORT, () => {
      console.log(` TrustDegree Backend running on http://localhost:${PORT}`);
      console.log(`  Database: connected`);
      console.log(` Contract Address: ${CONFIG.contractAddress}`);
      console.log(` RPC: ${CONFIG.rpcUrl}`);
    });
  } catch (error) {
    console.error(" Failed to initialize backend dependencies:", error);
    process.exit(1);
  }
};

void startServer();

export default app;
