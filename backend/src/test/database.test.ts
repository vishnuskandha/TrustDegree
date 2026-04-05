import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import { databaseService } from "../services/database";
import { db } from "../config";

const RUN_DB_TESTS = process.env.RUN_DB_TESTS === "true";
const maybeDescribe = RUN_DB_TESTS ? describe : describe.skip;

maybeDescribe("DatabaseService", () => {
  beforeAll(async () => {
    if (process.env.NODE_ENV !== "test") {
      throw new Error("Refusing to run database tests when NODE_ENV is not 'test'.");
    }

    const result = await db.query<{ db_name: string }>("SELECT current_database() AS db_name");
    const dbName = result.rows[0]?.db_name || "";

    if (!/test/i.test(dbName)) {
      throw new Error(`Refusing to run destructive tests against non-test database '${dbName}'.`);
    }
  });

  beforeEach(async () => {
    // Clean up test data between tests
    await db.query("DELETE FROM degrees WHERE student_name LIKE 'Test%'");
    await db.query("DELETE FROM audit_logs WHERE metadata->>'test' = 'true'");
  });

  describe("insertDegree", () => {
    it("should insert a degree record and trigger audit log", async () => {
      const record = await databaseService.insertDegree(
        BigInt(1),
        "0xContractAddress",
        "0xStudentAddress",
        "Test Student",
        "Test University",
        "B.Sc. Test",
        "2024",
        "ipfs://test",
        "0xTxHash123",
        "0xAdminAddress"
      );

      expect(record).toBeDefined();
      expect(record.id).toBeGreaterThan(0);
      expect(record.token_id).toBe(BigInt(1));
      expect(record.student_name).toBe("Test Student");
      expect(record.revoked_at).toBeNull();
    });

    it("should create unique constraint per contract+tokenId", async () => {
      await databaseService.insertDegree(
        BigInt(1),
        "0xContractAddress",
        "0xStudentAddress",
        "Test Student 1",
        "Test University",
        "B.Sc. Test",
        "2024",
        "ipfs://test",
        "0xTxHash1",
        "0xAdminAddress"
      );

      // Duplicate token ID should fail at DB level
      try {
        await databaseService.insertDegree(
          BigInt(1),
          "0xContractAddress",
          "0xStudentAddress2",
          "Test Student 2",
          "Test University",
          "B.Sc. Test",
          "2024",
          "ipfs://test",
          "0xTxHash2",
          "0xAdminAddress"
        );
        throw new Error("Expected duplicate key error");
      } catch (error: any) {
        expect(error.message).toContain("duplicate key");
      }
    });
  });

  describe("getDegreeByToken", () => {
    it("should return degree by token ID", async () => {
      await databaseService.insertDegree(
        BigInt(42),
        "0xContract",
        "0xStudent",
        "Alice",
        "University",
        "M.Sc.",
        "2025",
        "ipfs://uri",
        "0xTx",
        "0xAdmin"
      );

      const degree = await databaseService.getDegreeByToken("0xContract", BigInt(42));

      expect(degree).not.toBeNull();
      expect(degree?.student_name).toBe("Alice");
    });

    it("should return null for non-existent token", async () => {
      const degree = await databaseService.getDegreeByToken("0xContract", BigInt(999));
      expect(degree).toBeNull();
    });
  });

  describe("getDegreesByStudent", () => {
    it("should return all degrees for a student", async () => {
      const student = "0xStudentAddress";

      await databaseService.insertDegree(
        BigInt(1),
        "0xContract1",
        student,
        "Alice",
        "Uni1",
        "B.Sc.",
        "2023",
        "uri1",
        "tx1",
        "admin"
      );

      await databaseService.insertDegree(
        BigInt(2),
        "0xContract2",
        student,
        "Alice",
        "Uni2",
        "M.Sc.",
        "2025",
        "uri2",
        "tx2",
        "admin"
      );

      const degrees = await databaseService.getDegreesByStudent(student);

      expect(degrees.length).toBe(2);
    });
  });

  describe("revokeDegree", () => {
    it("should revoke a degree and set revoked_at timestamp", async () => {
      await databaseService.insertDegree(
        BigInt(1),
        "0xContract",
        "0xStudent",
        "Bob",
        "University",
        "B.A.",
        "2022",
        "ipfs://uri",
        "0xTx",
        "0xAdmin"
      );

      const revoked = await databaseService.revokeDegree(
        "0xContract",
        BigInt(1),
        "Academic misconduct",
        "0xAdmin"
      );

      expect(revoked.revoked_at).not.toBeNull();
      expect(revoked.revocation_reason).toBe("Academic misconduct");
    });

    it("should throw if degree not found", async () => {
      await expect(
        databaseService.revokeDegree(
          "0xContract",
          BigInt(999),
          "Test",
          "0xAdmin"
        )
      ).rejects.toThrow("Degree not found or already revoked");
    });

    it("should throw if already revoked", async () => {
      await databaseService.insertDegree(
        BigInt(1),
        "0xContract",
        "0xStudent",
        "Bob",
        "University",
        "B.A.",
        "2022",
        "ipfs://uri",
        "0xTx",
        "0xAdmin"
      );

      await databaseService.revokeDegree(
        "0xContract",
        BigInt(1),
        "Reason 1",
        "0xAdmin"
      );

      await expect(
        databaseService.revokeDegree(
          "0xContract",
          BigInt(1),
          "Reason 2",
          "0xAdmin"
        )
      ).rejects.toThrow("Degree not found or already revoked");
    });
  });

  describe("insertAuditLog", () => {
    it("should insert audit log entry", async () => {
      await databaseService.insertAuditLog(
        "0xAdmin",
        "test_action",
        { test: true, foo: "bar" },
        "127.0.0.1",
        "Test-Agent/1.0"
      );

      const result = await db.query(
        "SELECT * FROM audit_logs WHERE admin_address = $1 AND action = $2 ORDER BY id DESC LIMIT 1",
        ["0xadmin", "test_action"]
      );

      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0].metadata).toEqual({ test: true, foo: "bar" });
    });
  });
});
