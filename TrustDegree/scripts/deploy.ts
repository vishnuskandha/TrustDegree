import { ethers } from "hardhat";

async function main() {
  console.log("Deploying TrustDegree contract...");

  const TrustDegree = await ethers.getContractFactory("TrustDegree");
  const trustDegree = await TrustDegree.deploy();

  await trustDegree.waitForDeployment();

  const contractAddress = await trustDegree.getAddress();
  console.log(" TrustDegree deployed to:", contractAddress);
  console.log(" Contract Address (save this for backend & frontend):", contractAddress);

  // Verification details
  const deployTx = trustDegree.deploymentTransaction();
  console.log(" Deployment transaction hash:", deployTx?.hash);

  // Network info
  const network = await ethers.provider.getNetwork();
  console.log(" Network:", network.name, "Chain ID:", network.chainId);

  // Owner (admin) address
  const owner = await trustDegree.owner();
  console.log(" Admin/Owner address:", owner);

  console.log("\n Next steps:");
  console.log("1. Save contract address:", contractAddress);
  console.log("2. Update backend .env with CONTRACT_ADDRESS=" + contractAddress);
  console.log("3. Update frontend .env with VITE_CONTRACT_ADDRESS=" + contractAddress);
  console.log("4. For testnet, verify contract on Polygonscan if desired");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(" Deployment failed:", error);
    process.exit(1);
  });
