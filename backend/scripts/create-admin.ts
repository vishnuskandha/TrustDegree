import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config({ path: ".env" });

const {
  DATABASE_URL,
  PG_SSL_CA,
  NODE_ENV,
  ADMIN_WALLET_ADDRESS,
  ADMIN_NAME,
  ADMIN_EMAIL,
  ADMIN_IS_ACTIVE,
} = process.env;

const runtimeEnv = NODE_ENV || "development";
const isProductionLike = runtimeEnv === "production" || runtimeEnv === "staging";

const normalizeWalletAddress = (value: string | undefined): string => {
  if (!value) {
    throw new Error("ADMIN_WALLET_ADDRESS is required.");
  }

  const normalized = value.toLowerCase();
  if (!/^0x[a-f0-9]{40}$/.test(normalized)) {
    throw new Error("ADMIN_WALLET_ADDRESS must be a valid 42-character Ethereum wallet address.");
  }

  return normalized;
};

const parseAdminIsActive = (value: string | undefined): boolean => {
  if (!value) {
    return true;
  }

  const normalized = value.toLowerCase();
  if (normalized === "true") {
    return true;
  }

  if (normalized === "false") {
    return false;
  }

  throw new Error("ADMIN_IS_ACTIVE must be either true or false when provided.");
};

const main = async (): Promise<void> => {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is required.");
  }

  if (isProductionLike && !PG_SSL_CA) {
    throw new Error("PG_SSL_CA is required in production/staging.");
  }

  const walletAddress = normalizeWalletAddress(ADMIN_WALLET_ADDRESS);
  const adminName = (ADMIN_NAME || "Primary Admin").trim();
  const adminEmail = ADMIN_EMAIL?.trim() || null;
  const isActive = parseAdminIsActive(ADMIN_IS_ACTIVE);

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: isProductionLike
      ? {
          rejectUnauthorized: true,
          ca: PG_SSL_CA?.replace(/\\n/g, "\n"),
        }
      : false,
  });

  try {
    const result = await pool.query(
      `
      INSERT INTO admins (wallet_address, email, name, is_active)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (wallet_address)
      DO UPDATE SET
        email = COALESCE(EXCLUDED.email, admins.email),
        name = COALESCE(EXCLUDED.name, admins.name),
        is_active = EXCLUDED.is_active
      RETURNING id, wallet_address, email, name, is_active, created_at
      `,
      [walletAddress, adminEmail, adminName, isActive]
    );

    const admin = result.rows[0];
    console.log("Admin bootstrap completed.");
    console.log(`id=${admin.id}`);
    console.log(`wallet=${admin.wallet_address}`);
    console.log(`email=${admin.email || ""}`);
    console.log(`name=${admin.name || ""}`);
    console.log(`is_active=${admin.is_active}`);
  } finally {
    await pool.end();
  }
};

void main().catch((error: unknown) => {
  console.error("Admin bootstrap failed:", error);
  process.exit(1);
});
