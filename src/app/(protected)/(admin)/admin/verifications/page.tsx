"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { CheckCircle, ShieldCheck, Clock } from "lucide-react";

interface Verification {
  id: number;
  userId?: number;
  status: string;
  user?: { email: string; fullName: string };
  createdAt?: string;
}

interface PaginatedVerifications {
  data: Verification[];
  total: number;
  page: number;
}

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<PaginatedVerifications | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approveLoading, setApproveLoading] = useState<number | null>(null);

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        setLoading(true);
        const data = await adminService.getVerifications({ page: 1, limit: 20 });
        setVerifications(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch verifications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifications();
  }, []);

  const handleApprove = async (verificationId: number) => {
    try {
      setApproveLoading(verificationId);
      await adminService.approveVerification(verificationId);
      setVerifications((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          data: prev.data.map((v) =>
            v.id === verificationId ? { ...v, status: "APPROVED" } : v
          ),
        };
      });
    } catch (err) {
      alert("Failed to approve verification");
      console.error(err);
    } finally {
      setApproveLoading(null);
    }
  };

  const pendingVerifications = verifications?.data.filter(
    (v) => v.status === "PENDING"
  ) || [];
  const approvedVerifications = verifications?.data.filter(
    (v) => v.status === "APPROVED"
  ) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Identity Verifications
        </h1>
        <p className="text-gray-600 mt-2">
          Review and approve user identity verifications
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Verifications</p>
              <p className="text-2xl font-bold text-gray-900">
                {verifications?.total || 0}
              </p>
            </div>
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Review</p>
              <p className="text-2xl font-bold text-orange-600">
                {pendingVerifications.length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {approvedVerifications.length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && (
        <>
          {/* Pending Verifications */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ⏳ Pending Verifications
            </h2>
            {pendingVerifications.length > 0 ? (
              <div className="grid gap-4">
                {pendingVerifications.map((verification) => (
                  <div
                    key={verification.id}
                    className="bg-white rounded-lg border border-orange-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {verification.user?.fullName || "Unknown User"}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {verification.user?.email || "—"}
                        </p>
                        {verification.createdAt && (
                          <p className="text-gray-500 text-xs mt-2">
                            Submitted:{" "}
                            {new Date(
                              verification.createdAt
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleApprove(verification.id)}
                        disabled={approveLoading === verification.id}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        {approveLoading === verification.id
                          ? "Approving..."
                          : "Approve"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                No pending verifications
              </p>
            )}
          </div>

          {/* Approved Verifications */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ✅ Approved Verifications
            </h2>
            {approvedVerifications.length > 0 ? (
              <div className="grid gap-4">
                {approvedVerifications.map((verification) => (
                  <div
                    key={verification.id}
                    className="bg-white rounded-lg border border-green-200 p-4"
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {verification.user?.fullName || "Unknown User"}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {verification.user?.email || "—"}
                        </p>
                        {verification.createdAt && (
                          <p className="text-gray-500 text-xs mt-2">
                            Approved:{" "}
                            {new Date(
                              verification.createdAt
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        Verified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-center py-8">
                No approved verifications
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
