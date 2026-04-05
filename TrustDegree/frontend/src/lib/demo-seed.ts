/**
 * Demo Data Seeding Utility
 *
 * This script creates sample credentials for TrustDegree demo purposes.
 * It can be run manually or via a dev-only button in the admin panel.
 *
 * Usage:
 *   node --loader ts-node/esm src/lib/demo-seed.ts
 *   OR import and call seedDemoData() in development mode
 */

import { v4 as uuidv4 } from 'uuid';

// Demo credentials template
const demoCredentials = [
  {
    id: uuidv4(),
    studentName: "Alice Johnson",
    studentAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45",
    degreeType: "Bachelor of Science",
    field: "Computer Science",
    university: "Tech University",
    website: "https://techuni.edu",
    issueDate: new Date("2024-05-15"),
    txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    blockNumber: 45678901,
    tokenId: "TRD-2024-001",
    status: "valid" as const,
  },
  {
    id: uuidv4(),
    studentName: "Bob Williams",
    studentAddress: "0x8ba1f109551bD432803012645aac136c",
    degreeType: "Master of Business Administration",
    field: "Business Administration",
    university: "Global Business School",
    website: "https://globalbusiness.edu",
    issueDate: new Date("2024-06-20"),
    txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    blockNumber: 45679999,
    tokenId: "TRD-2024-002",
    status: "valid" as const,
  },
  {
    id: uuidv4(),
    studentName: "Carol Martinez",
    studentAddress: "0x9d7fA91c2D43bB92559C4812b43b6C4C85a9D23C",
    degreeType: "Doctor of Philosophy",
    field: "Physics",
    university: "Institute of Advanced Sciences",
    website: "https://ias.science",
    issueDate: new Date("2024-07-10"),
    txHash: "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
    blockNumber: 45681234,
    tokenId: "TRD-2024-003",
    status: "valid" as const,
  },
  {
    id: uuidv4(),
    studentName: "David Kim",
    studentAddress: "0x3f5CE5FbFe6E6465E8D5653E0612071652B4Db0f",
    degreeType: "Bachelor of Arts",
    field: "Graphic Design",
    university: "Creative Arts Academy",
    website: "https://creativearts.edu",
    issueDate: new Date("2024-08-05"),
    txHash: "0x11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff",
    blockNumber: 45682345,
    tokenId: "TRD-2024-004",
    status: "valid" as const,
  },
  {
    id: uuidv4(),
    studentName: "Eva Thompson",
    studentAddress: "0x2f7F471326B2c5017581E83bFC1744Fc45c8bDb3",
    degreeType: "Master of Science",
    field: "Data Science",
    university: "Data Institute",
    website: "https://datainstitute.edu",
    issueDate: new Date("2024-09-12"),
    txHash: "0x00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff",
    blockNumber: 45683456,
    tokenId: "TRD-2024-005",
    status: "valid" as const,
  },
  {
    id: uuidv4(),
    studentName: "Frank Miller",
    studentAddress: "0x8ba1f109551bD432803012645aac136c",
    degreeType: "Bachelor of Engineering",
    field: "Mechanical Engineering",
    university: "Polytechnic University",
    website: "https://polytech.edu",
    issueDate: new Date("2024-01-20"),
    txHash: "0x554433221100554433221100554433221100554433221100554433221100",
    blockNumber: 45670012,
    tokenId: "TRD-2024-006",
    status: "revoked" as const, // Example of revoked credential
    revokedAt: new Date("2024-02-15"),
    revocationReason: "Student requested cancellation",
  },
];

/**
 * Get stored credentials from localStorage
 */
function getStoredCredentials(): any[] {
  try {
    const data = localStorage.getItem('trustdegree_credentials');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save credentials to localStorage
 */
function saveCredentials(credentials: any[]): void {
  localStorage.setItem('trustdegree_credentials', JSON.stringify(credentials, null, 2));
}

/**
 * Clear existing demo data
 */
function clearDemoData(): void {
  const existing = getStoredCredentials();
  // Remove credentials with demo token IDs (TRD-2024-XXX)
  const filtered = existing.filter((c) => !c.tokenId?.startsWith('TRD-2024-'));
  saveCredentials(filtered);
  console.log(`Cleared ${existing.length - filtered.length} demo credentials`);
}

/**
 * Seed demo credentials
 */
export function seedDemoData(): void {
  // Check if running in browser
  if (typeof window === 'undefined' || !window.localStorage) {
    console.error('This script must run in a browser environment with localStorage');
    console.log('Run this in the browser console or import in a dev component');
    return;
  }

  // Clear existing demo data first
  clearDemoData();

  // Add demo credentials
  const existing = getStoredCredentials();
  const updated = [...existing, ...demoCredentials];
  saveCredentials(updated);

  console.log(`Seeded ${demoCredentials.length} demo credentials`);
  console.log('Total credentials in store:', updated.length);
  console.log('');
  console.log('Try verifying these sample diploma IDs:');
  demoCredentials.forEach((c) => {
    console.log(`   - ${c.tokenId} (${c.studentName}, ${c.university})`);
  });
  console.log('');
  console.log('Go to http://localhost:5173/verify and try one!');
}

/**
 * Auto-seed in development mode (if this module is imported)
 */
if (typeof window !== 'undefined' && import.meta.env?.DEV) {
  // Wait for DOM and localStorage to be ready
  setTimeout(() => {
    const existing = getStoredCredentials();
    const demoExists = existing.some((c) => c.tokenId?.startsWith('TRD-2024-'));
    if (!demoExists) {
      console.log('Auto-seeding demo data in development mode...');
      seedDemoData();
    }
  }, 1000);
}

export { demoCredentials };
export type { demoCredentials as DemoCredential };
