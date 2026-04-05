// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

/**
 * @title TrustDegree
 * @dev Soulbound token (non-transferable ERC721) for academic degrees
 * Only admin (owner) can mint and revoke tokens
 */
contract TrustDegree is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Revocation status mapping
    mapping(uint256 => bool) public revoked;

    event DegreeIssued(
        uint256 indexed tokenId,
        address indexed student,
        string studentName,
        string university,
        string degreeType,
        string graduationYear,
        string mintTxHash
    );

    event DegreeRevoked(
        uint256 indexed tokenId,
        address indexed student,
        string reason,
        string revokeTxHash
    );

    /**
     * @dev Constructor sets token name and symbol
     */
    constructor() ERC721("TrustDegree", "TDEG") Ownable() {}

    /**
     * @dev Mint a new degree token to a student (admin only)
     * @param to Student wallet address
     * @param studentName Full name of student
     * @param university Name of issuing institution
     * @param degreeType Degree type (e.g., "B.Sc. Computer Science")
     * @param graduationYear Graduation year (e.g., "2024")
     * @param uri Metadata URI containing credentials JSON (or IPFS hash)
     */
    function issueDegree(
        address to,
        string memory studentName,
        string memory university,
        string memory degreeType,
        string memory graduationYear,
        string memory uri
    ) external onlyOwner returns (uint256) {
        require(to != address(0), "Invalid recipient address");
        require(bytes(studentName).length > 0, "Student name required");
        require(bytes(university).length > 0, "University required");
        require(bytes(degreeType).length > 0, "Degree type required");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit DegreeIssued(
            tokenId,
            to,
            studentName,
            university,
            degreeType,
            graduationYear,
            ""
        );
    }

    /**
     * @dev Revoke a degree token (admin only)
     * @param tokenId Token ID to revoke
     * @param reason Reason for revocation (optional)
     */
    function revokeDegree(uint256 tokenId, string memory reason) external onlyOwner {
        require(_exists(tokenId), "Token does not exist");
        require(!revoked[tokenId], "Token already revoked");

        revoked[tokenId] = true;
        emit DegreeRevoked(tokenId, ownerOf(tokenId), reason, "");
    }

    /**
     * @dev Check if a token is valid (exists and not revoked)
     */
    function isValid(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId) && !revoked[tokenId];
    }

    /**
     * @dev Override transfers to make token non-transferable (soulbound)
     * Revert any transfer attempt except minting (from address 0) or burning (to address 0)
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        // Allow minting (from address(0)) and burning (to address(0))
        if (from == address(0) || to == address(0)) {
            super._beforeTokenTransfer(from, to, tokenId, batchSize);
            return;
        }

        // Prevent all other transfers (soulbound)
        revert("TrustDegree: tokens are non-transferable");
    }
}
