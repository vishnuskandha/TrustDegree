import { describe, it, expect, vi, beforeEach } from 'vitest';
import { demoCredentials } from '@/lib/demo-seed';

// Ensure demoCredentials is defined
if (!demoCredentials) {
  throw new Error('demoCredentials is not exported');
}

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('demo-seed utility', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('demoCredentials', () => {
    it('contains the expected number of demo credentials', () => {
      expect(demoCredentials).toHaveLength(6);
    });

    it('has valid credential structure', () => {
      const credential = demoCredentials[0];
      expect(credential).toHaveProperty('id');
      expect(credential).toHaveProperty('studentName');
      expect(credential).toHaveProperty('studentAddress');
      expect(credential).toHaveProperty('degreeType');
      expect(credential).toHaveProperty('field');
      expect(credential).toHaveProperty('university');
      expect(credential).toHaveProperty('website');
      expect(credential).toHaveProperty('issueDate');
      expect(credential).toHaveProperty('txHash');
      expect(credential).toHaveProperty('blockNumber');
      expect(credential).toHaveProperty('tokenId');
      expect(credential).toHaveProperty('status');
    });

    it('has valid status values', () => {
      const statuses = demoCredentials.map((c) => c.status);
      expect(statuses).toContain('valid');
      expect(statuses).toContain('revoked');
    });

    it('has properly formatted token IDs', () => {
      const tokenIds = demoCredentials.map((c) => c.tokenId);
      tokenIds.forEach((tokenId) => {
        expect(tokenId).toMatch(/^TRD-2024-\d{3}$/);
      });
    });

    it('has valid Ethereum addresses', () => {
      const addresses = demoCredentials.map((c) => c.studentAddress);
      addresses.forEach((address) => {
        // Ethereum addresses should start with 0x and be hex
        expect(address).toMatch(/^0x[a-fA-F0-9]+$/);
      });
    });

    it('all credentials have unique IDs', () => {
      const ids = demoCredentials.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(demoCredentials.length);
    });

    it('all credentials have unique token IDs', () => {
      const tokenIds = demoCredentials.map((c) => c.tokenId);
      const uniqueTokenIds = new Set(tokenIds);
      expect(uniqueTokenIds.size).toBe(demoCredentials.length);
    });
  });
});
