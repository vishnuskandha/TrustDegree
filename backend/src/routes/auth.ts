import { Router, Request, Response } from "express";
import Joi from "joi";
import crypto from "crypto";
import { ethers } from "ethers";
import { CONFIG } from "../config";
import { generateAdminToken } from "../middleware/auth";
import { databaseService } from "../services/database";

const router = Router();

interface LoginChallenge {
  nonce: string;
  message: string;
  expiresAt: number;
}

const CHALLENGE_TTL_MS = 5 * 60 * 1000;
const challengeStore = new Map<string, LoginChallenge>();

const walletSchema = Joi.object({
  walletAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required(),
});

const loginSchema = Joi.object({
  walletAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required(),
  signature: Joi.string().required(),
});

const buildChallengeMessage = (walletAddress: string, nonce: string): string => {
  return [
    "TrustDegree Admin Login",
    `Wallet: ${walletAddress.toLowerCase()}`,
    `Nonce: ${nonce}`,
    "This signature is valid for 5 minutes.",
  ].join("\n");
};

/**
 * POST /api/auth/challenge
 * Generate a one-time challenge for wallet signature verification
 */
router.post("/challenge", async (req: Request, res: Response) => {
  try {
    const { error, value } = walletSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const walletAddress = value.walletAddress.toLowerCase();
    if (walletAddress === CONFIG.contractAddress) {
      return res.status(400).json({
        error: "Wallet address cannot be the deployed contract address. Use a MetaMask wallet account address.",
      });
    }

    const isAdmin = await databaseService.isAdminActive(walletAddress);

    if (!isAdmin) {
      return res.status(403).json({ error: "Wallet is not an active admin" });
    }

    const nonce = crypto.randomBytes(16).toString("hex");
    const message = buildChallengeMessage(walletAddress, nonce);

    challengeStore.set(walletAddress, {
      nonce,
      message,
      expiresAt: Date.now() + CHALLENGE_TTL_MS,
    });

    res.json({
      success: true,
      walletAddress,
      message,
      expiresAt: new Date(Date.now() + CHALLENGE_TTL_MS).toISOString(),
    });
  } catch (error: any) {
    console.error("/api/auth/challenge error:", error);
    res.status(500).json({ error: "Failed to generate login challenge" });
  }
});

/**
 * POST /api/auth/admin-login
 * Simple admin login - in production use proper user management
 * For MVP: accepts wallet signature verification or pre-registered wallet addresses
 */
router.post("/admin-login", async (req: Request, res: Response) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const walletAddress = value.walletAddress.toLowerCase();
    const signature = value.signature;

    if (walletAddress === CONFIG.contractAddress) {
      return res.status(400).json({
        error: "Wallet address cannot be the deployed contract address. Use a MetaMask wallet account address.",
      });
    }

    const isAdmin = await databaseService.isAdminActive(walletAddress);
    if (!isAdmin) {
      return res.status(403).json({ error: "Wallet is not an active admin" });
    }

    const challenge = challengeStore.get(walletAddress);
    if (!challenge || challenge.expiresAt < Date.now()) {
      challengeStore.delete(walletAddress);
      return res.status(401).json({ error: "Challenge expired or missing. Request a new challenge." });
    }

    let recoveredAddress: string;
    try {
      recoveredAddress = ethers.verifyMessage(challenge.message, signature).toLowerCase();
    } catch {
      return res.status(401).json({ error: "Invalid signature" });
    }

    if (recoveredAddress !== walletAddress) {
      return res.status(401).json({ error: "Signature does not match wallet" });
    }

    challengeStore.delete(walletAddress);

    const token = generateAdminToken(walletAddress);

    res.json({
      success: true,
      token,
      walletAddress,
      role: "admin",
    });
  } catch (error: any) {
    console.error("/api/auth/admin-login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
