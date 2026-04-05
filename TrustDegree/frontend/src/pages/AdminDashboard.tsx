import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { LogOut, Award, Link as LinkIcon, Download, LayoutDashboard, ScanLine } from "lucide-react";
import { authAPI, issueAPI } from "../services/api";
import { config as apiConfig } from "../config/api";
import BrandMark from "../components/BrandMark";

interface IssuedDegree {
  tokenId: string;
  studentName: string;
  university: string;
  degreeType: string;
  verificationUrl: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    studentAddress: "",
    studentName: "",
    university: "",
    degreeType: "",
    graduationYear: new Date().getFullYear().toString(),
    metadataUri: `ipfs://placeholder-${Date.now()}`,
  });

  // After successful issue, show QR
  const [issuedDegree, setIssuedDegree] = useState<IssuedDegree | null>(null);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("adminToken");
    const storedWallet = sessionStorage.getItem("adminWallet");
    if (storedToken && storedWallet) {
      setWalletAddress(storedWallet);
      setIsLoggedIn(true);
    }
  }, []);

  const getSigner = async (expectedWalletAddress: string): Promise<ethers.Signer> => {
    const provider = (window as any).ethereum;
    if (!provider) {
      throw new Error("MetaMask is required for secure admin login");
    }

    const browserProvider = new ethers.BrowserProvider(provider);
    await browserProvider.send("eth_requestAccounts", []);
    const signer = await browserProvider.getSigner();
    const signerAddress = (await signer.getAddress()).toLowerCase();

    if (signerAddress !== expectedWalletAddress.toLowerCase()) {
      throw new Error("Connected wallet does not match entered wallet address");
    }

    return signer;
  };

  const formatLoginError = (err: any): string => {
    const status = err?.response?.status;
    const apiError = err?.response?.data?.error as string | undefined;
    const message = err?.message as string | undefined;
    const code = err?.code as string | undefined;

    // Network/offline case (backend down or wrong API URL)
    if (!err?.response && (code === "ERR_NETWORK" || err?.request)) {
      return `Cannot reach backend API (${apiConfig.apiUrl}). Start backend server and confirm API URL settings.`;
    }

    // Local client-side checks from getSigner
    if (message === "MetaMask is required for secure admin login") {
      return "MetaMask is required for admin login. Install/enable MetaMask and retry.";
    }

    if (message === "Connected wallet does not match entered wallet address") {
      return "Connected wallet does not match entered wallet address. Switch account in MetaMask or update the input address.";
    }

    if (code === "ACTION_REJECTED" || err?.code === 4001 || message?.includes("user rejected")) {
      return "Signature request was rejected in MetaMask. Click Connect Wallet and approve the signature to continue.";
    }

    // Backend auth-related responses
    if (status === 403 && apiError === "Wallet is not an active admin") {
      return "This wallet is not authorized as an active admin. Ask your system administrator to grant admin access.";
    }

    if (status === 401 && apiError?.includes("Challenge expired or missing")) {
      return "Login challenge expired. Click Connect Wallet again to request a new challenge.";
    }

    if (status === 401 && apiError?.includes("Invalid signature")) {
      return "Invalid wallet signature. Approve the exact message in MetaMask and try again.";
    }

    if (status === 401 && apiError?.includes("Signature does not match wallet")) {
      return "Signature does not match wallet. Ensure the connected MetaMask account matches the entered wallet.";
    }

    return apiError || "Login failed";
  };

  const handleLogin = async () => {
    const normalizedWallet = walletAddress.trim().toLowerCase();

    if (!normalizedWallet) {
      setError("Please enter wallet address");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const challengeRes = await authAPI.getChallenge(normalizedWallet);
      const signer = await getSigner(normalizedWallet);
      const signature = await signer.signMessage(challengeRes.data.message);

      const res = await authAPI.login(normalizedWallet, signature);
      sessionStorage.setItem("adminToken", res.data.token);
      sessionStorage.setItem("adminWallet", res.data.walletAddress);
      setIsLoggedIn(true);
    } catch (err: any) {
      setError(formatLoginError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminWallet");
    setWalletAddress("");
    setIsLoggedIn(false);
    setIssuedDegree(null);
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setIssuedDegree(null);

    try {
      const res = await issueAPI.issue(formData);
      setSuccess(res.data.message);

      setIssuedDegree({
        tokenId: res.data.data.tokenId,
        studentName: formData.studentName,
        university: formData.university,
        degreeType: formData.degreeType,
        verificationUrl: res.data.data.verificationUrl,
      });

      setFormData({
        ...formData,
        studentAddress: "",
        studentName: "",
        university: "",
        degreeType: "",
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Issue failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="page-shell page-content max-w-md mx-auto pt-10"
      >
        <div className="card pro-panel text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-primary-100 shadow-sm">
            <BrandMark className="w-9 h-9" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Admin Access</h2>
          <p className="text-slate-500 mb-8 font-medium">
            Secure portal for issuing blockchain credentials
          </p>
          
          <div className="space-y-5 text-left relative z-10">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                className="input-field font-mono"
              />
            </div>
            
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-600 text-sm font-medium bg-rose-50 p-3 rounded-lg border border-rose-100">
                {error}
              </motion.p>
            )}
            
            <button
              onClick={handleLogin}
              disabled={loading}
              className="btn-primary w-full py-4 text-lg"
            >
              {loading ? "Authenticating..." : "Connect Wallet"}
            </button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium bg-slate-50 p-3 rounded-lg">
              For demo purposes, any valid Ethereum address works. Production requires Web3 signature.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-shell page-content space-y-8 max-w-6xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pro-panel p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">University Dashboard</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-slate-500 text-sm font-mono bg-slate-100 px-2 py-0.5 rounded-md">
                {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
              </p>
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 shadow-sm font-medium">
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 shadow-sm font-medium">
          {success}
        </motion.div>
      )}

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Issue Form */}
        <div className="lg:col-span-7">
          <div className="card pro-panel">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <Award className="w-6 h-6 text-primary-600" />
              <h3 className="text-xl font-bold text-slate-800">Mint New Degree</h3>
            </div>
            
            <form onSubmit={handleIssue} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student Wallet Address *</label>
                  <input
                    type="text"
                    value={formData.studentAddress}
                    onChange={(e) => setFormData({ ...formData, studentAddress: e.target.value })}
                    placeholder="0x..."
                    className="input-field font-mono text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Student Name *</label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="Alice Johnson"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">University *</label>
                  <input
                    type="text"
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    placeholder="Tech University"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Degree Type *</label>
                  <input
                    type="text"
                    value={formData.degreeType}
                    onChange={(e) => setFormData({ ...formData, degreeType: e.target.value })}
                    placeholder="B.Sc. Computer Science"
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Graduation Year *</label>
                  <input
                    type="text"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    placeholder="2024"
                    className="input-field"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Metadata URI (IPFS hash) *</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={formData.metadataUri}
                      onChange={(e) => setFormData({ ...formData, metadataUri: e.target.value })}
                      placeholder="ipfs://..."
                      className="input-field pl-10 font-mono text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Confirming on Blockchain...
                    </span>
                  ) : (
                    "Mint & Issue Degree SBT"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* QR Code Panel */}
        <div className="lg:col-span-5">
          <div className="card pro-panel h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <ScanLine className="w-6 h-6 text-primary-600" />
              <h3 className="text-xl font-bold text-slate-800">Verification Passport</h3>
            </div>
            
            {issuedDegree ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center">
                <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-100 mb-6 group relative">
                  <div className="absolute inset-0 bg-primary-100 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10"></div>
                  <QRCodeSVG
                    value={issuedDegree.verificationUrl}
                    size={220}
                    level="H"
                    includeMargin={true}
                    className="rounded-xl"
                  />
                </div>
                
                <div className="w-full bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-3 text-center">Degree successfully minted!</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Token ID</span>
                      <span className="font-mono font-bold text-primary-700">#{issuedDegree.tokenId}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Recipient</span>
                      <span className="font-medium text-slate-800">{issuedDegree.studentName}</span>
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-slate-500">Degree</span>
                      <span className="font-medium text-slate-800">{issuedDegree.degreeType}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigator.clipboard.writeText(issuedDegree.verificationUrl)}
                  className="mt-6 text-primary-600 hover:text-primary-700 text-sm font-semibold flex items-center gap-1"
                >
                  <Download className="w-4 h-4" /> Copy Verification Link
                </button>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12">
                <div className="w-24 h-24 mb-4 rounded-full bg-slate-50 flex items-center justify-center ring-1 ring-slate-100">
                  <ScanLine className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-center text-sm font-medium px-8">
                  Fill out the form to mint a degree. The verification QR code will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={() => navigate("/admin/degrees")}
          className="btn-secondary flex items-center gap-2"
        >
          View Database & Logs
        </button>
      </div>
    </motion.div>
  );
}
