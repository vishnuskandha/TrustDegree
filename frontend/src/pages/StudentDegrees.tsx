import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { verifyAPI, StudentDegreesResponse } from "../services/api";
import { motion } from "framer-motion";
import { Wallet, GraduationCap, ShieldAlert } from "lucide-react";

export default function StudentDegrees() {
  const { address } = useParams<{ address: string }>();
  const normalizedAddress = address?.trim() ?? "";
  const [degrees, setDegrees] = useState<StudentDegreesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAddressValid = /^0x[a-fA-F0-9]{40}$/.test(normalizedAddress);
  const latestRequestId = useRef(0);

  useEffect(() => {
    if (normalizedAddress && isAddressValid) {
      fetchDegrees(normalizedAddress);
      return;
    }

    if (normalizedAddress && !isAddressValid) {
      setDegrees(null);
      setError("Invalid Ethereum address");
      setLoading(false);
    }
  }, [normalizedAddress, isAddressValid]);

  const fetchDegrees = async (studentAddress: string) => {
    const requestId = ++latestRequestId.current;
    setLoading(true);
    setError(null);
    setDegrees(null);
    try {
      const res = await verifyAPI.getStudentDegrees(studentAddress);
      if (requestId !== latestRequestId.current) return;
      setDegrees(res.data);
    } catch (err: any) {
      if (requestId !== latestRequestId.current) return;
      setDegrees(null);
      setError(err.response?.data?.error || "Failed to fetch degrees");
    } finally {
      if (requestId !== latestRequestId.current) return;
      setLoading(false);
    }
  };

  if (!normalizedAddress) {
    return (
      <div className="page-shell page-content max-w-3xl mx-auto">
        <div className="card pro-panel text-center py-12">
          <p className="text-gray-600">No wallet address provided.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell page-content max-w-4xl mx-auto">
      <div className="card pro-panel">
        <div className="pro-hero p-6 mb-6">
          <h2 className="text-3xl font-bold mb-2 text-white">Student Credentials</h2>
          <p className="text-sky-100">Blockchain-issued certificates linked to this wallet.</p>
        </div>

        <div className="mb-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Viewing credentials for:
          </p>
          <p className="font-mono text-sm bg-white p-2 rounded break-all border border-slate-200 mt-2">
            {normalizedAddress}
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading degrees...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 mt-0.5" />
            {error}
          </div>
        )}

        {!loading && !error && degrees && degrees.degrees.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No degrees found for this wallet.</p>
          </div>
        )}

        {!loading && !error && degrees && degrees.degrees.length > 0 && (
          <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-sm font-medium text-gray-700">
              {degrees.count} degree{degrees.count !== 1 ? "s" : ""} found
            </p>
            {degrees.degrees.map((deg, idx) => (
              <div
                key={idx}
                className="pro-panel border rounded-xl p-5 space-y-3 bg-white"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" />{deg.degreeType}</h4>
                    <p className="text-gray-600">{deg.university}</p>
                  </div>
                  <span
                    className={`badge ${deg.revoked ? "badge-error" : "badge-success"}`}
                  >
                    {deg.revoked ? "Revoked" : "Valid"}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Issued:</strong>{" "}
                    {new Date(deg.issuedAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Token:</strong> #{deg.tokenId}
                  </p>
                </div>

                {deg.revoked && deg.revocationReason && (
                  <div className="bg-red-50 p-3 rounded text-sm text-red-700">
                    <strong>Revocation reason:</strong> {deg.revocationReason}
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
