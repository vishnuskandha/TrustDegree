import dotenv from "dotenv";
import { Pool } from "pg";
import { ethers } from "ethers";

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
  POLYGON_RPC_URL,
  POLYGON_MUMBAI_RPC,
  BLOCK_EXPLORER_TX_BASE_URL,
  POLYGON_EXPLORER_TX_BASE_URL,
  ADMIN_WALLET_ADDRESS,
} = process.env;

const runtimeEnv = NODE_ENV || "development";
const isProductionLike = runtimeEnv === "production" || runtimeEnv === "staging";
const isTest = runtimeEnv === "test";
const isRenderRuntime = Boolean(
  process.env.RENDER ||
  process.env.RENDER_SERVICE_ID ||
  process.env.RENDER_EXTERNAL_HOSTNAME ||
  process.env.RENDER_EXTERNAL_URL
);
const isCloudRuntime = isProductionLike || isRenderRuntime;
const allowLocalDbFallback = runtimeEnv === "development" && !isRenderRuntime;

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

const isEvmAddress = (value: string): boolean => /^0x[a-fA-F0-9]{40}$/.test(value);
const isPrivateKey = (value: string): boolean => /^0x[a-fA-F0-9]{64}$/.test(value);
const isZeroEvmAddress = (value: string): boolean => /^0x0{40}$/i.test(value);
const isZeroPrivateKey = (value: string): boolean => /^0x0{64}$/i.test(value);

const requireEnv = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`${name} is required. Set it in backend/.env for local use or in platform secrets for deployment.`);
  }

  return value;
};

const parseAdminWalletAllowlist = (raw: string | undefined): string[] => {
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((address) => address.trim().toLowerCase())
    .filter((address) => address.length > 0);
};

if (!isTest && isCloudRuntime && !DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is required in cloud deployments (production/staging/Render). Set it to your managed PostgreSQL connection string."
  );
}

if (isTest && !TEST_DATABASE_URL) {
  throw new Error("TEST_DATABASE_URL is required when NODE_ENV=test to prevent accidental writes to non-test databases.");
}

const computedDatabaseUrl = isTest
  ? TEST_DATABASE_URL
  : (DATABASE_URL ||
    (allowLocalDbFallback
      ? `postgresql://${POSTGRES_USER || "postgres"}:${POSTGRES_PASSWORD || "password"}@${POSTGRES_HOST || "localhost"}:${POSTGRES_PORT || "5432"}/${POSTGRES_DB || "trustdegree"}`
      : undefined));

if (!computedDatabaseUrl) {
  throw new Error(
    "Unable to resolve database connection string. Configure DATABASE_URL (or TEST_DATABASE_URL in test mode)."
  );
}

const allowedOrigins = parseAllowedOrigins(ALLOWED_ORIGINS);
if (!isTest && isCloudRuntime && allowedOrigins.length === 0) {
  throw new Error(
    "ALLOWED_ORIGINS is required in cloud deployments. Set a comma-separated list of trusted frontend origins."
  );
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
const rpcUrl = requireEnv("POLYGON_RPC_URL or POLYGON_MUMBAI_RPC", POLYGON_RPC_URL || POLYGON_MUMBAI_RPC);

if (!isEvmAddress(contractAddress)) {
  throw new Error("CONTRACT_ADDRESS must be a valid 0x-prefixed 40-hex Ethereum address.");
}

if (isZeroEvmAddress(contractAddress)) {
  throw new Error("CONTRACT_ADDRESS cannot be the zero address. Set your deployed TrustDegree contract address.");
}

if (!isPrivateKey(adminPrivateKey)) {
  throw new Error("PRIVATE_KEY must be a valid 0x-prefixed 64-hex private key.");
}

if (isZeroPrivateKey(adminPrivateKey)) {
  throw new Error("PRIVATE_KEY cannot be all zeros. Set the real admin signer wallet private key.");
}

const adminSignerAddress = new ethers.Wallet(adminPrivateKey).address.toLowerCase();
const configuredAdminWallets = parseAdminWalletAllowlist(ADMIN_WALLET_ADDRESS);

for (const wallet of configuredAdminWallets) {
  if (!isEvmAddress(wallet)) {
    throw new Error("ADMIN_WALLET_ADDRESS must contain valid 0x-prefixed 40-hex Ethereum addresses.");
  }

  if (isZeroEvmAddress(wallet)) {
    throw new Error("ADMIN_WALLET_ADDRESS cannot include the zero address.");
  }
}

const allowedAdminWallets = Array.from(
  new Set([adminSignerAddress, ...configuredAdminWallets])
);

let parsedRpcUrl: URL;
try {
  // Validate upfront so startup errors point to env configuration, not downstream SDK failures.
  parsedRpcUrl = new URL(rpcUrl);
} catch {
  throw new Error("POLYGON_RPC_URL/POLYGON_MUMBAI_RPC must be a valid URL.");
}

if (!isTest && isCloudRuntime && parsedRpcUrl.protocol !== "https:") {
  throw new Error("POLYGON_RPC_URL/POLYGON_MUMBAI_RPC must use https:// in cloud deployments.");
}

const rawExplorerTxBaseUrl =
  BLOCK_EXPLORER_TX_BASE_URL ||
  POLYGON_EXPLORER_TX_BASE_URL ||
  "https://amoy.polygonscan.com/tx/";

let parsedExplorerTxBaseUrl: URL;
try {
  parsedExplorerTxBaseUrl = new URL(rawExplorerTxBaseUrl);
} catch {
  throw new Error("BLOCK_EXPLORER_TX_BASE_URL/POLYGON_EXPLORER_TX_BASE_URL must be a valid URL.");
}

if (!isTest && isCloudRuntime && parsedExplorerTxBaseUrl.protocol !== "https:") {
  throw new Error("BLOCK_EXPLORER_TX_BASE_URL/POLYGON_EXPLORER_TX_BASE_URL must use https:// in cloud deployments.");
}

const explorerTxBaseUrl = rawExplorerTxBaseUrl.endsWith("/")
  ? rawExplorerTxBaseUrl
  : `${rawExplorerTxBaseUrl}/`;

export const CONFIG = {
  databaseUrl: computedDatabaseUrl,
  jwtSecret,
  jwtExpiresIn: JWT_EXPIRES_IN || "7d",
  contractAddress: contractAddress.toLowerCase(),
  adminSignerAddress,
  allowedAdminWallets,
  rpcUrl,
  explorerTxBaseUrl,
  adminPrivateKey,
  allowedOrigins: resolvedAllowedOrigins,
  runtimeEnv,
};

export const db = new Pool({
  connectionString: CONFIG.databaseUrl,
  max: poolMax,
  idleTimeoutMillis: poolIdleTimeoutMillis,
  connectionTimeoutMillis: poolConnectionTimeoutMillis,
  ssl: !isTest && isCloudRuntime
    ? (PG_SSL_CA
      ? {
          rejectUnauthorized: true,
          ca: PG_SSL_CA.replace(/\\n/g, "\n"),
        }
      : {
          rejectUnauthorized: true,
        })
    : false,
});
