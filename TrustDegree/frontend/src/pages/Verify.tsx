import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine,
  ShieldAlert,
  Copy,
  ExternalLink,
  Calendar,
  MapPin,
  Hash,
  Award,
  User,
  QrCode,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  History,
} from "lucide-react";
import { verifyAPI, VerifyDegreeResponse, VerifySampleResponse } from "../services/api";
import { config } from "../config/api";
import { fadeInUp, scaleIn, staggerContainer, staggerItem } from "../lib/motion-config";
import { Button } from "../components/magic/Button";
import { Input } from "../components/magic/Input";
import { Card } from "../components/magic/Card";
import { QRCode } from "../components/magic/QRCode";
import { Avatar } from "../components/magic/Avatar";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Skeleton } from "@/components/magic/Skeleton";
import QRScanner from "../components/QRScanner";

// Last known fallback used if sample endpoint is unavailable.
const SAMPLE_CREDENTIAL_FALLBACK: VerifySampleResponse = {
  contractAddress: "0x5cB91F46836a9493526859234e628Ec2A3592618",
  tokenId: "12345",
};

// Storage key for verification history
const HISTORY_STORAGE_KEY = "trustdegree_verify_history";

interface HistoryItem {
  timestamp: number;
  data: VerifyDegreeResponse;
  contract: string;
  tokenId: string;
}

export default function Verify() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // Mode toggle: "manual" or "qr"
  const [mode, setMode] = useState<"manual" | "qr">(
    searchParams.get("contract") && searchParams.get("tokenId") ? "manual" : "manual"
  );

  // QR scanner state
  const [scanning, setScanning] = useState(false);

  // Form inputs
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [degree, setDegree] = useState<VerifyDegreeResponse | null>(null);
  const [verificationUrl, setVerificationUrl] = useState("");
  const [copied, setCopied] = useState(false);

  // Verification history
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getExplorerUrl = (txHash: string) => {
    return `${config.explorerUrl}${txHash}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Save to history
  const saveToHistory = useCallback((item: HistoryItem) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => !(h.contract === item.contract && h.tokenId === item.tokenId));
      const updated = [item, ...filtered].slice(0, 10);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Event handlers - MUST be defined before useEffect that uses them
  const handleVerify = useCallback(async (contract: string, tokenId: string) => {
    if (!contract || !tokenId) {
      setError(t("verify.error.missingFields"));
      return;
    }

    setLoading(true);
    setError(null);
    setDegree(null);
    setVerificationUrl(`${window.location.origin}/verify?contract=${contract}&tokenId=${tokenId}`);
    setCopied(false);

    try {
      const res = await verifyAPI.getDegree(contract, tokenId);
      setDegree(res.data);

      // Save to history
      saveToHistory({
        timestamp: Date.now(),
        data: res.data,
        contract,
        tokenId,
      });
    } catch (err: any) {
      if (!err.response) {
        setError(t("verify.error.backendUnavailable"));
      } else if (err.response?.status === 404) {
        setError(t("verify.error.notFound"));
      } else {
        setError(t("verify.error.verificationFailed"));
      }
    } finally {
      setLoading(false);
    }
  }, [saveToHistory, t]);

  const handleTrySample = useCallback(async () => {
    setError(null);
    setDegree(null);
    setVerificationUrl("");
    setCopied(false);

    try {
      const sampleRes = await verifyAPI.getSample();
      const sample = sampleRes.data;

      setContractAddress(sample.contractAddress);
      setTokenId(sample.tokenId);
      await handleVerify(sample.contractAddress, sample.tokenId);
    } catch (err: any) {
      if (!err.response) {
        setError(t("verify.error.backendUnavailable"));
        return;
      }

      if (err.response?.status === 404) {
        setError(t("verify.error.noSampleAvailable"));
        return;
      }

      // Keep a static fallback for partial backend compatibility.
      setContractAddress(SAMPLE_CREDENTIAL_FALLBACK.contractAddress);
      setTokenId(SAMPLE_CREDENTIAL_FALLBACK.tokenId);
      await handleVerify(SAMPLE_CREDENTIAL_FALLBACK.contractAddress, SAMPLE_CREDENTIAL_FALLBACK.tokenId);
    }
  }, [handleVerify, t]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(contractAddress, tokenId);
  };

  const handleQrScan = useCallback((decodedText: string) => {
    setScanning(false);
    // Expected format: ?contract=0x...&tokenId=123
    try {
      const url = new URL(decodedText);
      const contract = url.searchParams.get("contract");
      const tokenId = url.searchParams.get("tokenId");

      if (contract && tokenId) {
        setContractAddress(contract);
        setTokenId(tokenId);
        handleVerify(contract, tokenId);
      } else {
        setError(t("verify.error.invalidQr"));
      }
    } catch (err) {
      setError(t("verify.error.invalidQrFormat"));
    }
  }, [handleVerify, t]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load verification history:", err);
    }
  }, []);

  // Auto-submit from QR params or sample demo on mount
  useEffect(() => {
    const contract = searchParams.get("contract");
    const tokenId = searchParams.get("tokenId");
    const sample = searchParams.get("sample");

    if (sample === "true") {
      // Trigger sample demo using backend-provided newest credential.
      setTimeout(() => handleTrySample(), 100);
    } else if (contract && tokenId) {
      setContractAddress(contract);
      setTokenId(tokenId);
      // Use a timeout to avoid calling during render
      setTimeout(() => handleVerify(contract, tokenId), 0);
    }
  }, [searchParams, handleVerify, handleTrySample]);

  const isValid = degree?.valid && !degree?.revoked;
  const isRevoked = degree?.revoked;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="page-shell page-content max-w-5xl mx-auto py-8 space-y-8"
    >
      {/* Header Card */}
      <Card className="!p-0 overflow-hidden pro-panel border-slate-200/60">
        <div className="pro-hero px-8 py-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-300/20 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 ring-1 ring-white/20 shadow-lg"
            >
              <ScanLine className="w-10 h-10 text-primary-300" />
            </motion.div>
            <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">{t("verify.title")}</h1>
            <p className="text-sky-100 max-w-xl text-lg">
              {t("verify.subtitle")}
            </p>
          </div>
        </div>

        <div className="p-8 bg-gradient-to-b from-white/80 to-slate-50/70">
          {/* Mode Toggle */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setMode("manual")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
                mode === "manual"
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t("verify.mode.manual")}
            </button>
            <button
              onClick={() => setMode("qr")}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
                mode === "qr"
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t("verify.mode.qr")}
            </button>
          </div>

          {/* Try Sample Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleTrySample}
              className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium hover:from-purple-200 hover:to-pink-200 transition-all min-h-[44px]"
            >
              <span>{t("actions.trySample", { ns: "common" })}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Manual Input Form */}
          <AnimatePresence mode="wait">
            {mode === "manual" && (
              <motion.form
                key="manual"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleManualSubmit}
                className="space-y-6"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2 lg:col-span-1">
                    <Input
                      label={t("verify.form.contractLabel")}
                      value={contractAddress}
                      onChange={(e) => setContractAddress(e.target.value)}
                      placeholder={t("verify.form.contractPlaceholder")}
                      leftIcon={<Hash className="w-4 h-4" />}
                      helperText={t("verify.form.contractHelper")}
                      disabled={loading}
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <Input
                      label={t("verify.form.tokenLabel")}
                      value={tokenId}
                      onChange={(e) => setTokenId(e.target.value)}
                      placeholder={t("verify.form.tokenPlaceholder")}
                      leftIcon={<Award className="w-4 h-4" />}
                      helperText={t("verify.form.tokenHelper")}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={loading}
                    leftIcon={<ScanLine className="w-5 h-5" />}
                    className="px-12 py-6 text-lg shadow-xl shadow-primary-600/25"
                  >
                    {t("verify.form.submit")}
                  </Button>
                </div>
              </motion.form>
            )}

            {/* QR Scanner Mode */}
            {mode === "qr" && (
              <motion.div
                key="qr"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {!scanning ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-primary-600" />
                    </div>
                    <p className="text-slate-600 mb-6 text-lg">
                      {t("verify.qr.prompt")}
                    </p>
                    <Button
                      onClick={() => setScanning(true)}
                      size="lg"
                      leftIcon={<ScanLine className="w-5 h-5" />}
                      className="px-12 py-6 text-lg"
                    >
                      {t("verify.qr.start")}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative rounded-2xl overflow-hidden border-4 border-primary-500 shadow-2xl">
                      <div className="absolute inset-0 bg-primary-500/20 animate-pulse z-10 pointer-events-none"></div>
                      <QRScanner onScan={handleQrScan} onError={() => {}} removable={false} />
                    </div>
                    <div className="text-center">
                      <Button
                        onClick={() => setScanning(false)}
                        variant="outline"
                        size="sm"
                      >
                        {t("verify.qr.cancel")}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                role="alert"
                aria-live="assertive"
                className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 shadow-sm font-medium flex items-start gap-3"
              >
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-base">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Verification Result */}
      <AnimatePresence>
        {degree && (
          <motion.div
            key="result"
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-8"
          >
            {loading ? (
              <Card className="!p-0 overflow-hidden border-2 border-slate-200 pro-panel">
                <div className="px-8 py-6 bg-gradient-to-r from-slate-100 to-slate-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div className="space-y-3">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-32" />
                  </div>
                </div>
                <div className="p-8 bg-white space-y-8">
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <Skeleton className="h-4 w-32" />
                      <div className="space-y-4">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <Skeleton className="h-4 w-40" />
                      <div className="space-y-4">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-24 w-full" />
                      </div>
                    </div>
                  </div>
                  <Skeleton className="h-px w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </div>
              </Card>
            ) : (
              <Card
                className={`!p-0 overflow-hidden border-2 ${
                  isValid
                    ? "border-emerald-400/60 shadow-xl shadow-emerald-500/10"
                    : isRevoked
                    ? "border-rose-400/60 shadow-xl shadow-rose-500/10"
                    : "border-amber-400/60 shadow-xl shadow-amber-500/10"
                }`}
              >
                <div
                  className={`px-8 py-6 ${
                    isValid
                      ? "bg-gradient-to-r from-emerald-500 to-green-600"
                      : isRevoked
                      ? "bg-gradient-to-r from-rose-500 to-red-600"
                      : "bg-gradient-to-r from-amber-500 to-orange-600"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ rotate: -10, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm"
                    >
                      {isValid ? (
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      ) : isRevoked ? (
                        <XCircle className="w-8 h-8 text-white" />
                      ) : (
                        <AlertTriangle className="w-8 h-8 text-white" />
                      )}
                    </motion.div>
                    <div className="text-center sm:text-left">
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-white mb-1"
                      >
                        {isValid
                          ? t("verify.result.genuine")
                          : isRevoked
                          ? t("verify.result.revoked")
                          : t("verify.result.notFound")}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-white/90"
                      >
                        {isValid
                          ? t("verify.result.genuineDesc")
                          : isRevoked
                          ? t("verify.result.revokedDesc")
                          : t("verify.result.notFoundDesc")}
                      </motion.p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <StatusBadge
                      status={isValid ? "valid" : isRevoked ? "revoked" : "expired"}
                      size="lg"
                      showIcon={true}
                      className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/90">
                <div className="grid sm:grid-cols-2 gap-8 mb-8">
                  {/* Left Column: Student Info */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" /> {t("verify.result.studentInfo")}
                      </h3>
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60">
                        <div className="flex items-center gap-4 mb-4">
                          <Avatar className="w-16 h-16 text-lg bg-gradient-to-br from-primary-500 to-purple-600 text-white">
                            {getInitials(degree.student.name)}
                          </Avatar>
                          <div>
                            <p className="font-bold text-slate-800 text-lg mb-1">{degree.student.name}</p>
                            <p className="text-xs font-mono text-slate-500 bg-white px-2 py-1 rounded break-all">
                              {degree.student.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> {t("verify.result.institution")}
                      </h3>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                        <p className="font-semibold text-slate-800 text-lg">{degree.degree.university}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Right Column: Credential Details */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4" /> {t("verify.result.credentialDetails")}
                      </h3>
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60 space-y-4">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase mb-1">Degree</p>
                          <p className="font-bold text-slate-800 text-lg">{degree.degree.type}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase mb-1">Class Of</p>
                            <p className="font-semibold text-slate-800">{degree.degree.graduationYear}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-500 uppercase mb-1">Issued</p>
                            <p className="font-semibold text-slate-800">{formatDate(degree.issuedAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Hash className="w-4 h-4" /> {t("verify.result.blockchainData")}
                      </h3>
                      <div className="bg-slate-900 p-4 rounded-xl space-y-3 text-sm shadow-inner">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-1.5 border-b border-slate-700 gap-2">
                          <span className="text-slate-400 font-medium">{t("verify.result.contract")}</span>
                          <span className="font-mono text-primary-300 text-xs break-all bg-primary-900/30 px-2 py-1 rounded">
                            {degree.contractAddress.slice(0, 10)}...{degree.contractAddress.slice(-8)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-b border-slate-700">
                          <span className="text-slate-400 font-medium">{t("verify.result.diplomaNumber")}</span>
                          <span className="font-mono font-bold text-white">#{degree.tokenId}</span>
                        </div>
                        {degree.txHash && (
                          <div className="flex justify-between items-center py-1.5">
                            <span className="text-slate-400 font-medium">{t("verify.result.receipt")}</span>
                            <a
                              href={getExplorerUrl(degree.txHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-2 text-sm font-mono"
                            >
                              {degree.txHash.slice(0, 12)}...{degree.txHash.slice(-10)}
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Revocation Details */}
                <AnimatePresence>
                  {degree.revoked && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8"
                    >
                      <div className="bg-rose-50 border-l-4 border-rose-500 p-5 rounded-r-xl shadow-sm">
                        <h3 className="font-bold text-rose-800 flex items-center gap-2 mb-3 text-lg">
                          <ShieldAlert className="w-5 h-5" /> Revocation Details
                        </h3>
                        <div className="space-y-3 ml-7">
                          <p className="text-rose-700">
                            <span className="font-semibold">Reason:</span> {degree.revoked?.reason || "Administrative Revocation"}
                          </p>
                          <p className="text-rose-700 flex items-center gap-2">
                            <span className="font-semibold">Cancelled On:</span> <Calendar className="w-4 h-4" />{" "}
                            {formatDate(degree.revoked.at)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                  <div className="flex-1 space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                        <QrCode className="w-4 h-4" /> {t("verify.result.qrTitle")}
                      </h4>
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <QRCode value={verificationUrl} size={120} className="bg-white p-2 rounded-lg shadow-sm" />
                        <p className="text-sm text-slate-600">
                          {t("verify.result.qrDesc")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <Button
                      onClick={copyToClipboard}
                      variant={copied ? "primary" : "secondary"}
                      leftIcon={copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      className="flex-1 sm:flex-none"
                    >
                      {copied ? t("actions.copied") : t("verify.result.copyLink")}
                    </Button>
                    <Button
                      onClick={() =>
                        degree.txHash && window.open(getExplorerUrl(degree.txHash), "_blank", "noopener,noreferrer")
                      }
                      variant="outline"
                      rightIcon={<ExternalLink className="w-4 h-4" />}
                      disabled={!degree.txHash}
                      className="flex-1 sm:flex-none"
                    >
                      {t("verify.result.viewReceipt")}
                    </Button>
                  </div>
                </motion.div>
              </div>
            </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification History */}
      <AnimatePresence>
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 pro-panel">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  <History className="w-6 h-6 text-primary-600" />
                  {t("verify.history.title")}
                </h2>
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {history.length} {t("verify.history.count", { count: history.length })}
                </span>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-3"
              >
                {history.map((item, index) => (
                  <motion.button
                    key={`${item.contract}-${item.tokenId}-${index}`}
                    variants={staggerItem}
                    onClick={() => {
                      setContractAddress(item.contract);
                      setTokenId(item.tokenId);
                      handleVerify(item.contract, item.tokenId);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="group w-full text-left p-4 bg-slate-50 hover:bg-primary-50 border border-slate-200/60 hover:border-primary-200 rounded-xl cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 mb-1 truncate">{item.data.student.name}</p>
                        <p className="text-sm text-slate-600 truncate">
                          {item.data.degree.type} at {item.data.degree.university}
                        </p>
                        <p className="text-xs font-mono text-slate-400 mt-1">
                          #{item.tokenId} • {formatTimeAgo(item.timestamp)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <StatusBadge
                          status={item.data.valid && !item.data.revoked ? "valid" : "revoked"}
                          size="sm"
                        />
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>

              {history.length >= 10 && (
                <p className="text-xs text-slate-400 text-center mt-4">
                  {t("verify.history.limit")}
                </p>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
