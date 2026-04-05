-- TrustDegree Database Schema
-- PostgreSQL 12+

-- Degrees table: stores metadata for issued degree tokens
CREATE TABLE IF NOT EXISTS degrees (
  id SERIAL PRIMARY KEY,
  token_id BIGINT NOT NULL,
  contract_address VARCHAR(42) NOT NULL,
  student_address VARCHAR(42) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  university VARCHAR(255) NOT NULL,
  degree_type VARCHAR(255) NOT NULL,
  graduation_year VARCHAR(10) NOT NULL,
  metadata_uri TEXT NOT NULL,
  issued_at TIMESTAMP NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMP,
  revocation_reason TEXT,
  tx_hash VARCHAR(66), -- transaction hash (0x...)
  created_at TIMESTAMP DEFAULT NOW(),

  -- Ensure uniqueness per contract
  UNIQUE(contract_address, token_id),
  UNIQUE(contract_address, student_address, degree_type, graduation_year)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_degrees_token_id ON degrees(token_id);
CREATE INDEX IF NOT EXISTS idx_degrees_student_address ON degrees(student_address);
CREATE INDEX IF NOT EXISTS idx_degrees_contract_address ON degrees(contract_address);
CREATE INDEX IF NOT EXISTS idx_degrees_revoked ON degrees(revoked_at);

-- Audit logs: track admin actions
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  action VARCHAR(50) NOT NULL,
  admin_address VARCHAR(42) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_admin ON audit_logs(admin_address);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Optional: Admin users (if using JWT + DB auth instead of only JWT)
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admins_wallet ON admins(wallet_address);
