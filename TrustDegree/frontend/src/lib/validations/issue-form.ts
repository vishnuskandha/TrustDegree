import { z } from "zod";

// Ethereum address regex (case insensitive, accepts 0x prefix with 40 hex chars)
const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;

// Student name: 2-100 chars, letters and spaces only
const studentNameRegex = /^[a-zA-Z\s]{2,100}$/;

export const issueFormSchema = z.object({
  studentAddress: z
    .string()
    .min(1, "Wallet address is required")
    .regex(ethAddressRegex, "Invalid Ethereum address format"),
  studentName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(studentNameRegex, "Name can only contain letters and spaces"),
  university: z
    .string()
    .min(2, "University name is required")
    .max(100, "University name must be less than 100 characters"),
  degreeType: z
    .string()
    .min(2, "Degree type is required")
    .max(100, "Degree type must be less than 100 characters"),
  graduationYear: z
    .string()
    .regex(/^\d{4}$/, "Year must be a 4-digit number")
    .refine(
      (val) => {
        const year = parseInt(val, 10);
        return year >= 1900 && year <= 2100;
      },
      {
        message: "Year must be between 1900 and 2100",
      }
    ),
  metadataUri: z.string().url("Invalid URL format").optional().or(z.string().length(0)),
});

export type IssueFormData = z.infer<typeof issueFormSchema>;
