import { Router, Response } from "express";
import { databaseService } from "../services/database";
import { authenticateAdmin } from "../middleware/auth";

const router = Router();

/**
 * GET /api/admin/degrees
 * Admin: List all issued degrees (pagination)
 */
router.get("/degrees", authenticateAdmin, async (req: any, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;

    const { degrees, total } = await databaseService.listAllDegrees(limit, offset);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      degrees: degrees.map((d) => ({
        id: d.id,
        tokenId: d.token_id.toString(),
        contractAddress: d.contract_address,
        student: {
          address: d.student_address,
          name: d.student_name,
        },
        degree: {
          university: d.university,
          type: d.degree_type,
          year: d.graduation_year,
        },
        issuedAt: d.issued_at,
        txHash: d.tx_hash,
        revoked: !!d.revoked_at,
        revocationReason: d.revocation_reason,
      })),
    });
  } catch (error: any) {
    console.error(" /api/admin/degrees error:", error);
    res.status(500).json({ error: "Failed to fetch degrees list" });
  }
});

export default router;
