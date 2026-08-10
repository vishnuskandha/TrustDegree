// Ensure all backend tests run in an isolated test context.
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "test";
}

if (!process.env.TEST_DATABASE_URL) {
  process.env.TEST_DATABASE_URL = "postgresql://postgres:password@localhost:5432/trustdegree_test";
}

if (!process.env.RUN_DB_TESTS) {
  process.env.RUN_DB_TESTS = "false";
}

// config/index.ts requires these values at import time in every environment.
// Tests never touch the chain, so dummy-but-valid values are safe here.
// Override any of them from a real .env / environment when a test needs it.
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "test-jwt-secret-for-vitest-only";
}

if (!process.env.CONTRACT_ADDRESS) {
  // 0x...01: valid non-zero 40-hex address, never used on-chain in tests.
  process.env.CONTRACT_ADDRESS = `0x${"0".repeat(39)}1`;
}

if (!process.env.PRIVATE_KEY) {
  // 0x...01: valid non-zero 64-hex key, never used to sign in tests.
  process.env.PRIVATE_KEY = `0x${"0".repeat(63)}1`;
}

if (!process.env.POLYGON_RPC_URL && !process.env.POLYGON_MUMBAI_RPC) {
  process.env.POLYGON_MUMBAI_RPC = "https://rpc-mumbai.maticvigil.com";
}
