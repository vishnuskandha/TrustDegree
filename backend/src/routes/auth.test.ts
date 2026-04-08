import express from "express";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CONFIG } from "../config";

const { isAdminActiveMock } = vi.hoisted(() => ({
  isAdminActiveMock: vi.fn(),
}));

vi.mock("../services/database", () => ({
  databaseService: {
    isAdminActive: isAdminActiveMock,
  },
}));

import authRoutes from "./auth";

describe("auth route contract-address guard", () => {
  const app = express();
  app.use(express.json());
  app.use("/api/auth", authRoutes);

  beforeEach(() => {
    isAdminActiveMock.mockReset();
  });

  it("rejects challenge when wallet equals deployed contract address", async () => {
    const response = await request(app)
      .post("/api/auth/challenge")
      .send({ walletAddress: CONFIG.contractAddress });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("deployed contract address");
    expect(isAdminActiveMock).not.toHaveBeenCalled();
  });

  it("rejects admin-login when wallet equals deployed contract address", async () => {
    const response = await request(app)
      .post("/api/auth/admin-login")
      .send({
        walletAddress: CONFIG.contractAddress,
        signature: "0xdeadbeef",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("deployed contract address");
    expect(isAdminActiveMock).not.toHaveBeenCalled();
  });
});
