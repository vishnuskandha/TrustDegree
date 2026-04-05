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
const PORT = process.env.PORT || 3000;

const parseEnvInt = (raw: string | undefined, fallback: number): number => {
  const parsed = Number.parseInt(raw || "", 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5173"],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseEnvInt(process.env.RATE_LIMIT_WINDOW_MS, 900000), // 15 min
  max: parseEnvInt(process.env.RATE_LIMIT_MAX_REQUESTS, 100),
  message: "Too many requests from this IP, please try again later.",
});
app.use("/api", limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
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

    app.listen(PORT, () => {
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
