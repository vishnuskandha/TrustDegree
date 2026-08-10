import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Download, ScanLine, Clock, ShieldAlert, Award } from "lucide-react";
import { adminAPI } from "../services/api";
import { config } from "../config/api";

interface Degree {
  id: number;
  tokenId: string;
  student: {
    address: string;
    name: string;
  };
  degree: {
    university: string;
    type: string;
    year: string;
  };
  issuedAt: string;
  revoked: boolean;
  revocationReason: string | null;
  txHash?: string;
}

export default function AdminDegrees() {
  const navigate = useNavigate();
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(20);
  const [qrToken, setQrToken] = useState<string | null>(null);

  const fetchDegrees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminAPI.listDegrees(page, limit);
      setDegrees(res.data.degrees);
      setTotal(res.data.total);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch degrees");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchDegrees();
  }, [fetchDegrees]);

  const token = localStorage.getItem("adminToken");
  useEffect(() => {
    if (!token) {
      navigate("/admin");
    }
  }, [token, navigate]);

  if (!token) {
    return null;
  }

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="page-shell page-content space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pro-panel p-6 rounded-2xl">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Database Archive</h2>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Total Records: {total}
          </p>
        </div>
        <button onClick={() => navigate("/admin")} className="btn-secondary flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 shadow-sm font-medium">
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Interrogating Blockchain...</p>
        </div>
      ) : degrees.length === 0 ? (
        <div className="card pro-panel text-center py-20 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 ring-1 ring-slate-100">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Degrees Found</h3>
          <p className="text-slate-500 max-w-sm">There are no degrees recorded on the blockchain for this institution yet.</p>
        </div>
      ) : (
        <div className="card pro-panel !p-0 overflow-hidden shadow-glass border-slate-200/60">
          <div className="overflow-x-auto">
            <motion.table 
              variants={tableVariants}
              initial="hidden"
              animate="visible"
              className="min-w-full divide-y divide-slate-200/60"
            >
              <thead className="bg-slate-50/80 backdrop-blur-md">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Token ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Student Profile</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Credential</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                <AnimatePresence>
                  {degrees.map((degree) => (
                    <motion.tr 
                      key={degree.id} 
                      variants={rowVariants}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800 font-mono ring-1 ring-inset ring-slate-200">
                          #{degree.tokenId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-primary-100 to-indigo-100 flex items-center justify-center text-primary-700 font-bold shadow-inner">
                            {degree.student.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-slate-800">{degree.student.name}</div>
                            <div className="text-xs text-slate-500 font-mono bg-slate-50 px-1 rounded inline-block mt-0.5 border border-slate-100">
                              {degree.student.address.slice(0, 8)}...{degree.student.address.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-primary-500" /> {degree.degree.type}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {degree.degree.university} · Class of {degree.degree.year}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {degree.revoked ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200/50">
                            <ShieldAlert className="w-3 h-3" /> Revoked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/50">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Valid
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(degree.issuedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                          {degree.txHash && (
                            <a
                              href={`${config.explorerUrl}${degree.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-primary-600 transition-colors flex items-center gap-1 text-xs py-1.5 px-3 min-h-[44px]"
                              title="View Transaction"
                            >
                              Tx Hash
                            </a>
                          )}
                          <button
                            onClick={() => setQrToken(qrToken === degree.tokenId ? null : degree.tokenId)}
                            className="bg-primary-50 text-primary-600 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold min-h-[44px]"
                          >
                            <ScanLine className="w-3.5 h-3.5" />
                            {qrToken === degree.tokenId ? "Close QR" : "Get QR"}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </motion.table>
          </div>
          
          {/* Pagination Footer */}
          {total > limit && (
            <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-800">{(page - 1) * limit + 1}</span> to <span className="font-semibold text-slate-800">{Math.min(page * limit, total)}</span> of <span className="font-semibold text-slate-800">{total}</span> results
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center min-h-[44px]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * limit >= total}
                  className="px-3 py-2 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center min-h-[44px]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* QR Code Modal Overlay */}
      <AnimatePresence>
        {qrToken && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setQrToken(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="pro-panel bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary-400 to-indigo-500"></div>
              
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 text-primary-600">
                  <ScanLine className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Verification Passport</h3>
                <p className="text-slate-500 text-sm mt-1">Token ID <span className="font-mono font-bold text-slate-700">#{qrToken}</span></p>
              </div>
              
              <div className="flex justify-center mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <QRCodeSVG
                  value={`${window.location.origin}/verify?contract=${config.contractAddress}&tokenId=${qrToken}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                  className="rounded-lg bg-white"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/verify?contract=${config.contractAddress}&tokenId=${qrToken}`)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg transition-colors border border-slate-200"
                >
                  <Download className="w-4 h-4" /> Copy Direct Link
                </button>
                <button
                  onClick={() => setQrToken(null)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-colors shadow-md shadow-slate-900/20"
                >
                  Close Scanner
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
