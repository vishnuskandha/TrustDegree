import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({ path: ".env" });

const {
  DATABASE_URL,
  TEST_DATABASE_URL,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  PG_SSL_CA,
  ALLOWED_ORIGINS,
  PG_POOL_MAX,
  PG_POOL_IDLE_TIMEOUT_MS,
  PG_POOL_CONNECTION_TIMEOUT_MS,
  NODE_ENV,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  CONTRACT_ADDRESS,
  PRIVATE_KEY,
  POLYGON_MUMBAI_RPC,
} = process.env;

const runtimeEnv = NODE_ENV || "development";
const isProductionLike = runtimeEnv === "production" || runtimeEnv === "staging";
const isTest = runtimeEnv === "test";

const parseEnvInt = (raw: string | undefined, fallback: number, envName: string): number => {
  if (!raw) {
    return fallback;
  }

  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error(`${envName} must be a positive integer when provided.`);
  }

  return parsed;
};

const parseAllowedOrigins = (raw: string | undefined): string[] => {
  return (raw || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
};

const requireEnv = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`${name} is required. Set it in backend/.env for local use or in platform secrets for deployment.`);
  }

  return value;
};

if (isProductionLike && !DATABASE_URL) {
  throw new Error("DATABASE_URL is required in production/staging. Use your managed PostgreSQL connection string.");
}

if (isTest && !TEST_DATABASE_URL) {
  throw new Error("TEST_DATABASE_URL is required when NODE_ENV=test to prevent accidental writes to non-test databases.");
}

const computedDatabaseUrl = isTest
  ? TEST_DATABASE_URL
  : (DATABASE_URL ||
    `postgresql://${POSTGRES_USER || "postgres"}:${POSTGRES_PASSWORD || "password"}@${POSTGRES_HOST || "localhost"}:${POSTGRES_PORT || "5432"}/${POSTGRES_DB || "trustdegree"}`);

if (!computedDatabaseUrl) {
  throw new Error("Unable to resolve database connection string. Configure DATABASE_URL (or TEST_DATABASE_URL in test mode).");
}

if (isProductionLike && !PG_SSL_CA) {
  throw new Error("PG_SSL_CA is required in production/staging to enforce database TLS verification. Set the full PEM certificate with escaped newlines.");
}

const allowedOrigins = parseAllowedOrigins(ALLOWED_ORIGINS);
if (isProductionLike && allowedOrigins.length === 0) {
  throw new Error("ALLOWED_ORIGINS is required in production/staging. Set a comma-separated list of trusted frontend origins.");
}

const resolvedAllowedOrigins = allowedOrigins.length > 0
  ? allowedOrigins
  : ["http://localhost:5173"];

const poolMax = parseEnvInt(PG_POOL_MAX, 10, "PG_POOL_MAX");
const poolIdleTimeoutMillis = parseEnvInt(PG_POOL_IDLE_TIMEOUT_MS, 30000, "PG_POOL_IDLE_TIMEOUT_MS");
const poolConnectionTimeoutMillis = parseEnvInt(PG_POOL_CONNECTION_TIMEOUT_MS, 10000, "PG_POOL_CONNECTION_TIMEOUT_MS");

const jwtSecret = requireEnv("JWT_SECRET", JWT_SECRET);
const contractAddress = requireEnv("CONTRACT_ADDRESS", CONTRACT_ADDRESS);
const adminPrivateKey = requireEnv("PRIVATE_KEY", PRIVATE_KEY);
const rpcUrl = requireEnv("POLYGON_MUMBAI_RPC", POLYGON_MUMBAI_RPC);

export const CONFIG = {
  databaseUrl: computedDatabaseUrl,
  jwtSecret,
  jwtExpiresIn: JWT_EXPIRES_IN || "7d",
  contractAddress: contractAddress.toLowerCase(),
  rpcUrl,
  adminPrivateKey,
  allowedOrigins: resolvedAllowedOrigins,
  runtimeEnv,
};

export const db = new Pool({
  connectionString: CONFIG.databaseUrl,
  max: poolMax,
  idleTimeoutMillis: poolIdleTimeoutMillis,
  connectionTimeoutMillis: poolConnectionTimeoutMillis,
  ssl: isProductionLike
    ? {
        rejectUnauthorized: true,
        ca: PG_SSL_CA?.replace(/\\n/g, "\n"),
      }
    : false,
});
