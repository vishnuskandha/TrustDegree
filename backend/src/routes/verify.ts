import { Router, Request, Response } from "express";
import { databaseService } from "../services/database";
import { blockchainService } from "../services/blockchain";

const router = Router();

router.get("/verify/sample", async (_req: Request, res: Response) => {
  try {
    const latestDegree = await databaseService.getLatestDegree();
    if (!latestDegree) return res.status(404).json({ error: "No sample credential available" });
    res.json({ contractAddress: latestDegree.contract_address, tokenId: latestDegree.token_id.toString() });
  } catch (error: any) {
    console.error(" /api/verify/sample error:", error);
    res.status(500).json({ error: "Failed to fetch sample credential" });
  }
});

router.get("/degrees/:studentAddress", async (req: Request, res: Response) => {
  try {
    const studentAddress = (req.params.studentAddress || "").trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(studentAddress)) return res.status(400).json({ error: "Invalid Ethereum address" });

    const degrees = await databaseService.getDegreesByStudent(studentAddress);
    const result = degrees.map((d) => ({
      tokenId: d.token_id.toString(), contractAddress: d.contract_address,
      studentName: d.student_name, university: d.university, degreeType: d.degree_type,
      graduationYear: d.graduation_year, issuedAt: d.issued_at, revoked: !!d.revoked_at,
      revocationReason: d.revocation_reason || null,
    }));
    res.json({ studentAddress, count: result.length, degrees: result });
  } catch (error: any) {
    console.error(" /api/degrees error:", error);
    res.status(500).json({ error: "Failed to fetch degrees" });
  }
});

router.get("/verify/:contractAddress/:tokenId", async (req: Request, res: Response) => {
  try {
    const contractAddress = (req.params.contractAddress || "").trim();
    const tokenId = (req.params.tokenId || "").trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) return res.status(400).json({ error: "Invalid contract address" });
    if (!/^\d+$/.test(tokenId)) return res.status(400).json({ error: "Invalid token ID" });

    const numericTokenId = BigInt(tokenId);
    const dbDegree = await databaseService.getDegreeByToken(contractAddress, numericTokenId);
    if (!dbDegree) {
      return res.status(404).json({ valid: false, error: "Degree not found in database", message: "Degree not found in database" });
    }

    // Verify the token on the same contract the caller and database identify.
    const onChainValid = await blockchainService.isValid(numericTokenId, contractAddress);

    const response: any = {
      valid: onChainValid && !dbDegree.revoked_at,
      tokenId, contractAddress,
      student: { address: dbDegree.student_address, name: dbDegree.student_name },
      degree: { university: dbDegree.university, type: dbDegree.degree_type, graduationYear: dbDegree.graduation_year },
      issuedAt: dbDegree.issued_at,
      metadataUri: dbDegree.metadata_uri,
      txHash: dbDegree.tx_hash,
      chain: { txHash: dbDegree.tx_hash, blockExplorerUrl: `https://amoy.polygonscan.com/tx/${dbDegree.tx_hash}` },
    };

    if (dbDegree.revoked_at) {
      response.revoked = { at: dbDegree.revoked_at, reason: dbDegree.revocation_reason };
      response.valid = false;
    }
    res.json(response);
  } catch (error: any) {
    console.error(" /api/verify error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
});

export default router;
