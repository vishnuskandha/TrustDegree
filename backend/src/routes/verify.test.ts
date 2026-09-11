import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { getDegreeByTokenMock, isValidMock } = vi.hoisted(() => ({
  getDegreeByTokenMock: vi.fn(),
  isValidMock: vi.fn(),
}));

vi.mock("../services/database", () => ({
  databaseService: { getDegreeByToken: getDegreeByTokenMock },
}));
vi.mock("../services/blockchain", () => ({
  blockchainService: { isValid: isValidMock },
}));

import verifyRoutes from "./verify";

const contract = "0x1111111111111111111111111111111111111111";
const degree = {
  token_id: 7n,
  contract_address: contract,
  student_address: "0x2222222222222222222222222222222222222222",
  student_name: "Test Student",
  university: "Test University",
  degree_type: "BSc",
  graduation_year: "2026",
  issued_at: "2026-01-01T00:00:00.000Z",
  revoked_at: null,
  revocation_reason: null,
  metadata_uri: "ipfs://metadata",
  tx_hash: "0xabc",
};

describe("verify route", () => {
  const app = express();
  app.use("/api", verifyRoutes);

  beforeEach(() => {
    getDegreeByTokenMock.mockReset();
    isValidMock.mockReset();
    getDegreeByTokenMock.mockResolvedValue(degree);
    isValidMock.mockResolvedValue(true);
  });

  it("checks validity against the requested contract address", async () => {
    const response = await request(app).get(`/api/verify/${contract}/7`);

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(true);
    expect(isValidMock).toHaveBeenCalledWith(7n, contract);
  });

  it("fails closed when on-chain verification is unavailable", async () => {
    isValidMock.mockResolvedValue(false);

    const response = await request(app).get(`/api/verify/${contract}/7`);

    expect(response.status).toBe(200);
    expect(response.body.valid).toBe(false);
  });
});
