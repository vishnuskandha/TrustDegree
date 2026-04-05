import fs from "fs/promises";
import path from "path";
import { db } from "../config";

export interface DegreeRecord {
  id: number;
  token_id: bigint;
  contract_address: string;
  student_address: string;
  student_name: string;
  university: string;
  degree_type: string;
  graduation_year: string;
  metadata_uri: string;
  issued_at: Date;
  revoked_at: Date | null;
  revocation_reason: string | null;
  tx_hash: string | null;
  created_at: Date;
}

export interface DegreeMetadata {
  tokenId: bigint;
  contractAddress: string;
  studentAddress: string;
  studentName: string;
  university: string;
  degreeType: string;
  graduationYear: string;
  metadataUri: string;
  issuedAt: string;
  revoked: boolean;
  revocationReason?: string;
  txHash?: string;
}

export class DatabaseService {
  private initialized = false;

  async isAdminActive(walletAddress: string): Promise<boolean> {
    const result = await db.query(
      `
      SELECT 1
      FROM admins
      WHERE wallet_address = $1
        AND is_active = TRUE
      LIMIT 1
      `,
      [walletAddress.toLowerCase()]
    );

    return result.rows.length > 0;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const schemaCandidates = [
      process.env.SCHEMA_SQL_PATH,
      path.resolve(__dirname, "../../sql/schema.sql"),
      path.resolve(process.cwd(), "sql/schema.sql"),
      path.resolve(process.cwd(), "backend/sql/schema.sql"),
    ].filter((candidate): candidate is string => !!candidate);

    let schemaPath: string | null = null;

    for (const candidate of schemaCandidates) {
      try {
        await fs.access(candidate);
        schemaPath = candidate;
        break;
      } catch {
        continue;
      }
    }

    if (!schemaPath) {
      throw new Error("Unable to locate schema.sql. Set SCHEMA_SQL_PATH or ensure backend/sql/schema.sql is packaged.");
    }

    const schemaSql = await fs.readFile(schemaPath, "utf-8");
    await db.query(schemaSql);

    this.initialized = true;
  }

  async close(): Promise<void> {
    await db.end();
    this.initialized = false;
  }

  async ping(): Promise<void> {
    await db.query("SELECT 1");
  }

  private mapDegreeRow(row: any): DegreeRecord {
    return {
      id: row.id,
      token_id: BigInt(row.token_id),
      contract_address: row.contract_address,
      student_address: row.student_address,
      student_name: row.student_name,
      university: row.university,
      degree_type: row.degree_type,
      graduation_year: row.graduation_year,
      metadata_uri: row.metadata_uri,
      issued_at: row.issued_at,
      revoked_at: row.revoked_at,
      revocation_reason: row.revocation_reason,
      tx_hash: row.tx_hash,
      created_at: row.created_at,
    };
  }

  async insertDegree(
    tokenId: bigint,
    contractAddress: string,
    studentAddress: string,
    studentName: string,
    university: string,
    degreeType: string,
    graduationYear: string,
    metadataUri: string,
    txHash: string,
    adminAddress: string
  ): Promise<DegreeRecord> {
    const inserted = await db.query(
      `
      INSERT INTO degrees (
        token_id,
        contract_address,
        student_address,
        student_name,
        university,
        degree_type,
        graduation_year,
        metadata_uri,
        tx_hash
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
      `,
      [
        tokenId.toString(),
        contractAddress.toLowerCase(),
        studentAddress.toLowerCase(),
        studentName,
        university,
        degreeType,
        graduationYear,
        metadataUri,
        txHash,
      ]
    );

    await this.insertAuditLog(adminAddress, "degree_issued", {
      tokenId: tokenId.toString(),
      studentAddress,
      studentName,
      degreeType,
      txHash,
    });

    return this.mapDegreeRow(inserted.rows[0]);
  }

  async getDegreeByToken(
    contractAddress: string,
    tokenId: bigint
  ): Promise<DegreeRecord | null> {
    const result = await db.query(
      `
      SELECT *
      FROM degrees
      WHERE contract_address = $1
        AND token_id = $2
      LIMIT 1
      `,
      [contractAddress.toLowerCase(), tokenId.toString()]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapDegreeRow(result.rows[0]);
  }

  async getLatestDegree(): Promise<DegreeRecord | null> {
    const result = await db.query(
      `
      SELECT *
      FROM degrees
      ORDER BY issued_at DESC
      LIMIT 1
      `
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapDegreeRow(result.rows[0]);
  }

  async getDegreesByStudent(studentAddress: string): Promise<DegreeRecord[]> {
    const result = await db.query(
      `
      SELECT *
      FROM degrees
      WHERE student_address = $1
      ORDER BY issued_at DESC
      `,
      [studentAddress.toLowerCase()]
    );

    return result.rows.map((row) => this.mapDegreeRow(row));
  }

  async revokeDegree(
    contractAddress: string,
    tokenId: bigint,
    reason: string,
    adminAddress: string
  ): Promise<DegreeRecord> {
    const updated = await db.query(
      `
      UPDATE degrees
      SET revoked_at = NOW(),
          revocation_reason = $1
      WHERE contract_address = $2
        AND token_id = $3
        AND revoked_at IS NULL
      RETURNING *
      `,
      [reason, contractAddress.toLowerCase(), tokenId.toString()]
    );

    if (updated.rows.length === 0) {
      throw new Error("Degree not found or already revoked");
    }

    const record = this.mapDegreeRow(updated.rows[0]);

    await this.insertAuditLog(adminAddress, "degree_revoked", {
      tokenId: tokenId.toString(),
      studentAddress: record.student_address,
      reason,
    });

    return record;
  }

  async insertAuditLog(
    adminAddress: string,
    action: string,
    metadata: Record<string, any>,
    ip?: string,
    userAgent?: string
  ): Promise<void> {
    await db.query(
      `
      INSERT INTO audit_logs (
        action,
        admin_address,
        metadata,
        ip_address,
        user_agent
      ) VALUES ($1, $2, $3, $4, $5)
      `,
      [action, adminAddress.toLowerCase(), metadata, ip || null, userAgent || null]
    );
  }

  async listAllDegrees(
    limit = 50,
    offset = 0
  ): Promise<{ degrees: DegreeRecord[]; total: number }> {
    const [degreesResult, totalResult] = await Promise.all([
      db.query(
        `
        SELECT *
        FROM degrees
        ORDER BY issued_at DESC
        LIMIT $1 OFFSET $2
        `,
        [limit, offset]
      ),
      db.query("SELECT COUNT(*)::int AS total FROM degrees"),
    ]);

    return {
      degrees: degreesResult.rows.map((row) => this.mapDegreeRow(row)),
      total: totalResult.rows[0]?.total || 0,
    };
  }
}

export const databaseService = new DatabaseService();
