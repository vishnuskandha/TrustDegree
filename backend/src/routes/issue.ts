import { Router, Request, Response } from "express";
import Joi from "joi";
import { blockchainService } from "../services/blockchain";
import { databaseService } from "../services/database";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

/**
 * Validation schema for issuing a single degree
 */
const issueSchema = Joi.object({
  studentAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required()
    .messages({ "string.pattern.base": "Invalid Ethereum address" }),
  studentName: Joi.string().min(1).max(255).required(),
  university: Joi.string().min(1).max(255).required(),
  degreeType: Joi.string().min(1).max(255).required(),
  graduationYear: Joi.string().length(4).required(),
  metadataUri: Joi.string().uri().required(),
});

/**
 * POST /api/issue
 * Admin: Issue a new degree token
 */
router.post("/", authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { error, value } = issueSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      studentAddress,
      studentName,
      university,
      degreeType,
      graduationYear,
      metadataUri,
    } = value;

    const adminAddress = (req as any).user.walletAddress;

    // 1. Mint on blockchain
    const { tokenId, txHash } = await blockchainService.issueDegree(
      studentAddress,
      studentName,
      university,
      degreeType,
      graduationYear,
      metadataUri
    );

    // 2. Store metadata in database
    await databaseService.insertDegree(
      tokenId,
      blockchainService.getContractAddress(),
      studentAddress,
      studentName,
      university,
      degreeType,
      graduationYear,
      metadataUri,
      txHash,
      adminAddress
    );

    // 3. Return success response with verification URL
    const verificationUrl = `${process.env.API_URL || "http://localhost:3000"}/api/verify/${blockchainService.getContractAddress()}/${tokenId}`;

    res.status(201).json({
      success: true,
      message: "Degree issued successfully",
      data: {
        tokenId: tokenId.toString(),
        contractAddress: blockchainService.getContractAddress(),
        studentAddress,
        txHash,
        verificationUrl,
      },
    });
  } catch (error: any) {
    console.error(" /api/issue error:", error);
    res.status(500).json({ error: error.message || "Issue failed" });
  }
});

export default router;
