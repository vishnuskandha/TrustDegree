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

if (isProductionLike && !DATABASE_URL) {
  throw new Error("DATABASE_URL is required in production/staging.");
}

if (isTest && !TEST_DATABASE_URL) {
  throw new Error("TEST_DATABASE_URL is required when NODE_ENV=test to prevent accidental writes to non-test databases.");
}

const computedDatabaseUrl = isTest
  ? TEST_DATABASE_URL
  : (DATABASE_URL ||
    `postgresql://${POSTGRES_USER || "postgres"}:${POSTGRES_PASSWORD || "password"}@${POSTGRES_HOST || "localhost"}:${POSTGRES_PORT || "5432"}/${POSTGRES_DB || "trustdegree"}`);

if (!JWT_SECRET || !CONTRACT_ADDRESS || !PRIVATE_KEY || !POLYGON_MUMBAI_RPC || !computedDatabaseUrl) {
  throw new Error("Missing required environment variables. Check .env file.");
}

if (isProductionLike && !PG_SSL_CA) {
  throw new Error("PG_SSL_CA is required in production/staging to enforce database TLS verification.");
}

export const CONFIG = {
  databaseUrl: computedDatabaseUrl,
  jwtSecret: JWT_SECRET,
  jwtExpiresIn: JWT_EXPIRES_IN || "7d",
  contractAddress: CONTRACT_ADDRESS?.toLowerCase() || "",
  rpcUrl: POLYGON_MUMBAI_RPC,
  adminPrivateKey: PRIVATE_KEY,
};

export const db = new Pool({
  connectionString: CONFIG.databaseUrl,
  ssl: isProductionLike
    ? {
        rejectUnauthorized: true,
        ca: PG_SSL_CA?.replace(/\\n/g, "\n"),
      }
    : false,
});
