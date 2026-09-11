import { ethers } from "ethers";
import { CONFIG } from "../config";

// TrustDegree ABI (minimal required methods)
export const TRUSTDEGREE_ABI = [
  "function issueDegree(address to, string studentName, string university, string degreeType, string graduationYear, string uri) external returns (uint256)",
  "function revokeDegree(uint256 tokenId, string reason) external",
  "function isValid(uint256 tokenId) external view returns (bool)",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function tokenURI(uint256 tokenId) external view returns (string)",
  "function revoked(uint256 tokenId) external view returns (bool)",
  "event DegreeIssued(uint256 indexed tokenId, address indexed student, string studentName, string university, string degreeType, string graduationYear, string mintTxHash)",
  "event DegreeRevoked(uint256 indexed tokenId, address indexed student, string reason, string revokeTxHash)",
];

export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(CONFIG.rpcUrl);
    this.wallet = new ethers.Wallet(CONFIG.adminPrivateKey, this.provider);
    this.contract = new ethers.Contract(
      CONFIG.contractAddress,
      TRUSTDEGREE_ABI,
      this.wallet
    );
  }

  async issueDegree(
    studentAddress: string,
    studentName: string,
    university: string,
    degreeType: string,
    graduationYear: string,
    metadataUri: string
  ): Promise<{ tokenId: bigint; txHash: string }> {
    try {
      const tx = await this.contract.issueDegree(
        studentAddress,
        studentName,
        university,
        degreeType,
        graduationYear,
        metadataUri
      );

      const receipt = await tx.wait();
      let tokenId: string | null = null;
      for (const log of receipt.logs) {
        try {
          const parsed = this.contract.interface.parseLog({
            topics: [...log.topics],
            data: log.data
          });
          if (parsed?.name === "DegreeIssued") {
            tokenId = parsed.args.tokenId.toString();
            break;
          }
        } catch {
          continue;
        }
      }

      if (!tokenId) throw new Error("Failed to extract tokenId from transaction receipt");
      return { tokenId: BigInt(tokenId), txHash: receipt.hash };
    } catch (error: any) {
      console.error(" issueDegree error:", error);
      throw new Error(`Blockchain issue failed: ${error.message}`);
    }
  }

  async revokeDegree(tokenId: bigint, reason: string): Promise<string> {
    try {
      const tx = await this.contract.revokeDegree(tokenId, reason);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error: any) {
      console.error(" revokeDegree error:", error);
      throw new Error(`Blockchain revoke failed: ${error.message}`);
    }
  }

  /**
   * Check on-chain validity against the exact contract being verified.
   */
  async isValid(tokenId: bigint, contractAddress = CONFIG.contractAddress): Promise<boolean> {
    try {
      const normalizedAddress = ethers.getAddress(contractAddress);
      const contract = normalizedAddress.toLowerCase() === CONFIG.contractAddress.toLowerCase()
        ? this.contract
        : new ethers.Contract(normalizedAddress, TRUSTDEGREE_ABI, this.provider);
      return await contract.isValid(tokenId);
    } catch (error: any) {
      console.error(" isValid error:", error);
      return false;
    }
  }

  async getOwner(tokenId: bigint): Promise<string> {
    try {
      return await this.contract.ownerOf(tokenId);
    } catch (error: any) {
      console.error(" getOwner error:", error);
      throw new Error(`Failed to fetch owner: ${error.message}`);
    }
  }

  async getTokenURI(tokenId: bigint): Promise<string> {
    try {
      return await this.contract.tokenURI(tokenId);
    } catch (error: any) {
      console.error(" getTokenURI error:", error);
      throw new Error(`Failed to fetch tokenURI: ${error.message}`);
    }
  }

  getContractAddress(): string { return CONFIG.contractAddress; }
  getAdminAddress(): string { return this.wallet.address; }
}

export const blockchainService = new BlockchainService();
