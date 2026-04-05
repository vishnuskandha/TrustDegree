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
