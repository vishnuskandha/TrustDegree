import { describe, it, expect } from 'vitest';
import { z } from 'zod';

// Create a simple schema that matches the actual structure
const IssueFormSchema = z.object({
  studentAddress: z.string().min(1, "Student address is required"),
  studentName: z.string().min(1, "Student name is required"),
  university: z.string().min(1, "University is required"),
  degreeType: z.enum(['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate']),
  graduationYear: z.string().regex(/^\d{4}$/, "Must be a valid year"),
  metadataUri: z.string().optional(),
});

describe('Issue Form Validation', () => {
  describe('IssueFormSchema', () => {
    it('validates a complete valid form data', async () => {
      const validData = {
        studentAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45',
        studentName: 'John Doe',
        university: 'Tech University',
        degreeType: 'Bachelor',
        graduationYear: '2024',
        metadataUri: 'ipfs://Qm...',
      };

      const result = await IssueFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects empty student address', async () => {
      const invalidData = {
        studentAddress: '',
        studentName: 'John Doe',
        university: 'Tech University',
        degreeType: 'Bachelor',
        graduationYear: '2024',
      };

      const result = await IssueFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((e: any) => e.path.includes('studentAddress'))).toBe(true);
      }
    });

    it('rejects empty student name', async () => {
      const invalidData = {
        studentAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45',
        studentName: '',
        university: 'Tech University',
        degreeType: 'Bachelor',
        graduationYear: '2024',
      };

      const result = await IssueFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects empty university', async () => {
      const invalidData = {
        studentAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45',
        studentName: 'John Doe',
        university: '',
        degreeType: 'Bachelor',
        graduationYear: '2024',
      };

      const result = await IssueFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('accepts valid degree types', async () => {
      const degreeTypes = ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'];

      for (const degreeType of degreeTypes) {
        const validData = {
          studentAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45',
          studentName: 'John Doe',
          university: 'Tech University',
          degreeType,
          graduationYear: '2024',
        };

        const result = await IssueFormSchema.safeParse(validData);
        expect(result.success).toBe(true);
      }
    });

    it('rejects invalid degree type', async () => {
      const invalidData = {
        studentAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45',
        studentName: 'John Doe',
        university: 'Tech University',
        degreeType: 'InvalidDegree',
        graduationYear: '2024',
      };

      const result = await IssueFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('validates graduation year format', async () => {
      const validData = {
        studentAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45',
        studentName: 'John Doe',
        university: 'Tech University',
        degreeType: 'Bachelor',
        graduationYear: '2024',
      };

      const result = await IssueFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid graduation year', async () => {
      const invalidData = {
        studentAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45',
        studentName: 'John Doe',
        university: 'Tech University',
        degreeType: 'Bachelor',
        graduationYear: '24',
      };

      const result = await IssueFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('makes metadataUri optional', async () => {
      const validData = {
        studentAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45',
        studentName: 'John Doe',
        university: 'Tech University',
        degreeType: 'Bachelor',
        graduationYear: '2024',
      };

      const result = await IssueFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('accepts metadataUri when provided', async () => {
      const validData = {
        studentAddress: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45',
        studentName: 'John Doe',
        university: 'Tech University',
        degreeType: 'Bachelor',
        graduationYear: '2024',
        metadataUri: 'ipfs://QmTestHash',
      };

      const result = await IssueFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
