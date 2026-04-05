import { Router, Response } from "express";
import Joi from "joi";
import { blockchainService } from "../services/blockchain";
import { databaseService } from "../services/database";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

/**
 * Validation: single degree in batch
 */
const batchDegreeSchema = Joi.object({
  studentAddress: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{40}$/)
    .required(),
  studentName: Joi.string().min(1).max(255).required(),
  university: Joi.string().min(1).max(255).required(),
  degreeType: Joi.string().min(1).max(255).required(),
  graduationYear: Joi.string().length(4).required(),
  metadataUri: Joi.string().uri().required(),
});

const batchSchema = Joi.object({
  degrees: Joi.array().items(batchDegreeSchema).min(1).required(),
}).required();

/**
 * POST /api/batch-issue
 * Admin: Batch issue multiple degrees
 */
router.post("/batch-issue", authenticateAdmin, async (req: any, res: Response) => {
  try {
    const { error, value } = batchSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const adminAddress = req.user.walletAddress;
    const results: any[] = [];
    const failures: any[] = [];

    // Process each degree sequentially (could parallelize with care)
    for (let i = 0; i < value.degrees.length; i++) {
      const degree = value.degrees[i];
      try {
        const { tokenId, txHash } = await blockchainService.issueDegree(
          degree.studentAddress,
          degree.studentName,
          degree.university,
          degree.degreeType,
          degree.graduationYear,
          degree.metadataUri
        );

        await databaseService.insertDegree(
          tokenId,
          blockchainService.getContractAddress(),
          degree.studentAddress,
          degree.studentName,
          degree.university,
          degree.degreeType,
          degree.graduationYear,
          degree.metadataUri,
          txHash,
          adminAddress
        );

        results.push({
          index: i,
          tokenId: tokenId.toString(),
          studentAddress: degree.studentAddress,
          txHash,
          status: "issued",
        });
      } catch (err: any) {
        failures.push({
          index: i,
          studentAddress: degree.studentAddress,
          error: err.message,
        });
      }
    }

    res.status(201).json({
      success: true,
      total: value.degrees.length,
      issued: results.length,
      failed: failures.length,
      results,
      failures,
    });
  } catch (error: any) {
    console.error(" /api/batch-issue error:", error);
    res.status(500).json({ error: error.message || "Batch issue failed" });
  }
});

/**
 * PUT /api/revoke/:tokenId
 * Admin: Revoke a degree token
 */
router.put("/revoke/:tokenId", authenticateAdmin, async (req: any, res: Response) => {
  try {
    const { tokenId } = req.params;
    const { reason } = req.body;

    if (!/^\d+$/.test(tokenId)) {
      return res.status(400).json({ error: "Invalid token ID" });
    }

    if (!reason || typeof reason !== "string" || reason.length > 500) {
      return res.status(400).json({ error: "Invalid or missing reason (max 500 chars)" });
    }

    const numericTokenId = BigInt(tokenId);
    const adminAddress = req.user.walletAddress;
    const contractAddress = blockchainService.getContractAddress();

    // 1. Revoke on-chain
    const txHash = await blockchainService.revokeDegree(numericTokenId, reason);

    // 2. Update database
    const record = await databaseService.revokeDegree(
      contractAddress,
      numericTokenId,
      reason,
      adminAddress
    );

    res.json({
      success: true,
      message: "Degree revoked successfully",
      data: {
        tokenId,
        studentAddress: record.student_address,
        reason,
        txHash,
      },
    });
  } catch (error: any) {
    console.error(" /api/revoke error:", error);
    res.status(500).json({ error: error.message || "Revoke failed" });
  }
});

export default router;
