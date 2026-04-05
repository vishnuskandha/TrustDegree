/// <reference types="vite/client" />

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
const EXPLORER_URL = import.meta.env.VITE_POLYGON_MUMBAI_EXPLORER || "https://mumbai.polygonscan.com/tx/";

export const config = {
  apiUrl: `${API_URL}/api`,
  contractAddress: CONTRACT_ADDRESS,
  explorerUrl: EXPLORER_URL,
};
