import axios from "axios";
import { config } from "../config/api";

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to requests if stored
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";
    const isAuthBootstrapRequest =
      requestUrl.includes("/auth/challenge") || requestUrl.includes("/auth/admin-login");
    const authHeader =
      error.config?.headers?.Authorization || error.config?.headers?.authorization;
    const requestWasAuthenticated = !!authHeader;

    // Keep login-related 401 errors local so the UI can show actionable messages.
    if (error.response?.status === 401 && requestWasAuthenticated && !isAuthBootstrapRequest) {
      sessionStorage.removeItem("adminToken");
      sessionStorage.removeItem("adminWallet");
      window.location.href = "/admin";
    }
    return Promise.reject(error);
  }
);

export interface IssueDegreeRequest {
  studentAddress: string;
  studentName: string;
  university: string;
  degreeType: string;
  graduationYear: string;
  metadataUri: string;
}

export interface IssueDegreeResponse {
  success: boolean;
  message: string;
  data: {
    tokenId: string;
    contractAddress: string;
    studentAddress: string;
    txHash: string;
    verificationUrl: string;
  };
}

export interface VerifyDegreeResponse {
  valid: boolean;
  tokenId: string;
  contractAddress: string;
  student: {
    address: string;
    name: string;
  };
  degree: {
    university: string;
    type: string;
    graduationYear: string;
  };
  issuedAt: string;
  metadataUri: string;
  txHash?: string;
  revoked?: {
    at: string;
    reason: string;
  };
}

export interface VerifySampleResponse {
  contractAddress: string;
  tokenId: string;
}

export interface StudentDegreesResponse {
  studentAddress: string;
  count: number;
  degrees: Array<{
    tokenId: string;
    contractAddress: string;
    studentName: string;
    university: string;
    degreeType: string;
    graduationYear: string;
    issuedAt: string;
    revoked: boolean;
    revocationReason: string | null;
  }>;
}

export interface AdminLoginRequest {
  walletAddress: string;
  signature: string;
}

export interface AdminChallengeResponse {
  success: boolean;
  walletAddress: string;
  message: string;
  expiresAt: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token: string;
  walletAddress: string;
  role: string;
}

export const authAPI = {
  getChallenge: (walletAddress: string) =>
    api.post<AdminChallengeResponse>("/auth/challenge", { walletAddress }),

  login: (walletAddress: string, signature: string) =>
    api.post<AdminLoginResponse>("/auth/admin-login", { walletAddress, signature }),
};

export const issueAPI = {
  issue: (data: IssueDegreeRequest) =>
    api.post<IssueDegreeResponse>("/issue", data),

  batchIssue: (degrees: IssueDegreeRequest[]) =>
    api.post<any>("/batch-issue", { degrees }),

  revoke: (tokenId: string, reason: string) =>
    api.put(`/revoke/${tokenId}`, { reason }),
};

export const verifyAPI = {
  getDegree: (contractAddress: string, tokenId: string) =>
    api.get<VerifyDegreeResponse>(
      `/verify/${encodeURIComponent(contractAddress.trim())}/${encodeURIComponent(tokenId.trim())}`
    ),

  getSample: () =>
    api.get<VerifySampleResponse>("/verify/sample"),

  getStudentDegrees: (studentAddress: string) =>
    api.get<StudentDegreesResponse>(`/degrees/${encodeURIComponent(studentAddress.trim())}`),
};

export const adminAPI = {
  listDegrees: (page = 1, limit = 50) =>
    api.get<{ degrees: any[]; total: number; page: number; totalPages: number }>(
      `/admin/degrees?page=${page}&limit=${limit}`
    ),
};

export default api;
