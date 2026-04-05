import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const mumbaiRpcUrl = process.env.MUMBAI_RPC_URL || "https://rpc-mumbai.maticvigil.com";
const privateKey = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    },
    mumbai: {
      url: mumbaiRpcUrl,
      accounts: privateKey ? [privateKey] : [],
      chainId: 80001,
      gasPrice: 20000000000, // 20 gwei
      gas: 2100000
    }
  },
  etherscan: {
    apiKey: {
      mumbai: process.env.POLYGONSCAN_API_KEY || ""
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config;
