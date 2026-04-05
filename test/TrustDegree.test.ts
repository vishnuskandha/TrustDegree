import { expect } from "chai";
import { ethers } from "hardhat";
import { TrustDegree } from "../typechain-types";

describe("TrustDegree - Soulbound Degree Token", function () {
  let trustDegree: TrustDegree;
  let owner: any;
  let student: any;
  let admin: any;
  let random: any;

  const MOCK_URI = "ipfs://QmExampleHash";
  const STUDENT_NAME = "Alice Johnson";
  const UNIVERSITY = "Tech University";
  const DEGREE_TYPE = "B.Sc. Computer Science";
  const GRADUATION_YEAR = "2024";

  beforeEach(async function () {
    [owner, student, admin, random] = await ethers.getSigners();

    const TrustDegreeFactory = await ethers.getContractFactory("TrustDegree");
    trustDegree = (await TrustDegreeFactory.deploy()) as TrustDegree;
    await trustDegree.waitForDeployment();

    // Set owner as admin (by default deployer is owner)
    expect(await trustDegree.owner()).to.equal(owner.address);
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await trustDegree.name()).to.equal("TrustDegree");
      expect(await trustDegree.symbol()).to.equal("TDEG");
    });

    it("Should set the deployer as owner", async function () {
      expect(await trustDegree.owner()).to.equal(owner.address);
    });
  });

  describe("issueDegree", function () {
    it("Should mint a new degree token to student (admin only)", async function () {
      await trustDegree.issueDegree(
        student.address,
        STUDENT_NAME,
        UNIVERSITY,
        DEGREE_TYPE,
        GRADUATION_YEAR,
        MOCK_URI
      );

      const tokenId = 0; // First token starts at 0
      expect(await trustDegree.ownerOf(tokenId)).to.equal(student.address);
      expect(await trustDegree.tokenURI(tokenId)).to.equal(MOCK_URI);
      expect(await trustDegree.revoked(tokenId)).to.be.false;
    });

    it("Should increment token IDs correctly", async function () {
      await trustDegree.issueDegree(
        student.address,
        STUDENT_NAME,
        UNIVERSITY,
        DEGREE_TYPE,
        GRADUATION_YEAR,
        MOCK_URI
      );

      await trustDegree.issueDegree(
        student.address,
        "Bob Smith",
        UNIVERSITY,
        "M.Sc. Data Science",
        "2025",
        MOCK_URI
      );

      expect(await trustDegree.ownerOf(0)).to.equal(student.address);
      expect(await trustDegree.ownerOf(1)).to.equal(student.address);
    });

    it("Should revert if non-admin attempts to mint", async function () {
      const TrustDegreeAsStudent = trustDegree.connect(random);
      await expect(
        TrustDegreeAsStudent.issueDegree(
          student.address,
          STUDENT_NAME,
          UNIVERSITY,
          DEGREE_TYPE,
          GRADUATION_YEAR,
          MOCK_URI
        )
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if recipient is zero address", async function () {
      await expect(
        trustDegree.issueDegree(
          ethers.ZeroAddress,
          STUDENT_NAME,
          UNIVERSITY,
          DEGREE_TYPE,
          GRADUATION_YEAR,
          MOCK_URI
        )
      ).to.be.revertedWith("Invalid recipient address");
    });

    it("Should emit DegreeIssued event with correct parameters", async function () {
      const tx = await trustDegree.issueDegree(
        student.address,
        STUDENT_NAME,
        UNIVERSITY,
        DEGREE_TYPE,
        GRADUATION_YEAR,
        MOCK_URI
      );

      await expect(tx)
        .to.emit(trustDegree, "DegreeIssued")
        .withArgs(0, student.address, STUDENT_NAME, UNIVERSITY, DEGREE_TYPE, GRADUATION_YEAR, "");
    });
  });

  describe("revokeDegree", function () {
    beforeEach(async function () {
      await trustDegree.issueDegree(
        student.address,
        STUDENT_NAME,
        UNIVERSITY,
        DEGREE_TYPE,
        GRADUATION_YEAR,
        MOCK_URI
      );
    });

    it("Should revoke a degree token (admin only)", async function () {
      await trustDegree.revokeDegree(0, "Academic misconduct");
      expect(await trustDegree.revoked(0)).to.be.true;
    });

    it("Should revert if non-admin attempts revocation", async function () {
      const TrustDegreeAsRandom = trustDegree.connect(random);
      await expect(
        TrustDegreeAsRandom.revokeDegree(0, "Test reason")
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if token does not exist", async function () {
      await expect(
        trustDegree.revokeDegree(999, "Test reason")
      ).to.be.revertedWith("Token does not exist");
    });

    it("Should revert if token already revoked", async function () {
      await trustDegree.revokeDegree(0, "First reason");
      await expect(
        trustDegree.revokeDegree(0, "Second reason")
      ).to.be.revertedWith("Token already revoked");
    });
  });

  describe("isValid", function () {
    it("Should return true for valid unrevoked token", async function () {
      await trustDegree.issueDegree(
        student.address,
        STUDENT_NAME,
        UNIVERSITY,
        DEGREE_TYPE,
        GRADUATION_YEAR,
        MOCK_URI
      );

      expect(await trustDegree.isValid(0)).to.be.true;
    });

    it("Should return false for revoked token", async function () {
      await trustDegree.issueDegree(
        student.address,
        STUDENT_NAME,
        UNIVERSITY,
        DEGREE_TYPE,
        GRADUATION_YEAR,
        MOCK_URI
      );

      await trustDegree.revokeDegree(0, "Test reason");
      expect(await trustDegree.isValid(0)).to.be.false;
    });

    it("Should return false for non-existent token", async function () {
      expect(await trustDegree.isValid(999)).to.be.false;
    });
  });

  describe("Soulbound (non-transferable) behavior", function () {
    beforeEach(async function () {
      await trustDegree.issueDegree(
        student.address,
        STUDENT_NAME,
        UNIVERSITY,
        DEGREE_TYPE,
        GRADUATION_YEAR,
        MOCK_URI
      );
    });

    it("Should revert on transferFrom attempt", async function () {
      const TrustDegreeAsStudent = trustDegree.connect(student);
      await expect(
        TrustDegreeAsStudent.transferFrom(student.address, random.address, 0)
      ).to.be.revertedWith("TrustDegree: tokens are non-transferable");
    });

    it("Should revert on safeTransferFrom attempt", async function () {
      const TrustDegreeAsStudent = trustDegree.connect(student);
      await expect(
        TrustDegreeAsStudent["safeTransferFrom(address,address,uint256)"](student.address, random.address, 0)
      ).to.be.revertedWith("TrustDegree: tokens are non-transferable");
    });

    it("Should allow owner to keep token in student wallet", async function () {
      // Token should remain with student
      expect(await trustDegree.ownerOf(0)).to.equal(student.address);
    });
  });

  describe("Approvals", function () {
    beforeEach(async function () {
      await trustDegree.issueDegree(
        student.address,
        STUDENT_NAME,
        UNIVERSITY,
        DEGREE_TYPE,
        GRADUATION_YEAR,
        MOCK_URI
      );
    });

    it("Should allow approval on existing token", async function () {
      const TrustDegreeAsStudent = trustDegree.connect(student);
      await expect(TrustDegreeAsStudent.approve(random.address, 0)).to.not.be.reverted;
      expect(await trustDegree.getApproved(0)).to.equal(random.address);
    });

    it("Should allow setApprovalForAll", async function () {
      const TrustDegreeAsStudent = trustDegree.connect(student);
      await expect(TrustDegreeAsStudent.setApprovalForAll(random.address, true)).to.not.be.reverted;
      expect(await trustDegree.isApprovedForAll(student.address, random.address)).to.equal(true);
    });
  });
});
