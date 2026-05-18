"use client";

import api from "@/lib/axios";
import { useState } from "react";
import {
  Check,
  X,
  Clock3,
  DollarSign,
  Mail,
  Loader2,
} from "lucide-react";

type Props = {
  application: {
    id: number;
    status: string;
    offered_price: number;
    applied_at: string;

    performer: {
      id: number;
      fullName: string;
      email: string;
      profileImage?: string | null;
    };
  };

  onUpdated: () => void;
};

export default function ApplicationCard({
  application,
  onUpdated,
}: Props) {
  const [loading, setLoading] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  const getStatusStyle = () => {
    switch (application.status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-700 border-green-200";

      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200";

      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  const handleAccept = async () => {
    try {
      setLoading(true);

      await api.patch(
        `/applications/${application.id}/accept`,
        {}
      );

      onUpdated();
    } catch (err: any) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Failed to accept application"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);

      await api.patch(
        `/applications/${application.id}/reject`,
        {}
      );

      onUpdated();
    } catch (err: any) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          "Failed to reject application"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        group rounded-3xl border border-slate-200
        bg-white p-6
        shadow-sm transition-all duration-300
        hover:-translate-y-1 hover:shadow-2xl
      "
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {/* LEFT */}
        <div className="flex items-start gap-4">
          {/* AVATAR */}
          <div
            className="
              h-16 w-16 overflow-hidden
              rounded-2xl bg-slate-100
              border border-slate-200
              shrink-0
            "
          >
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${application.performer.fullName}`}
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>

          {/* INFO */}
          <div className="space-y-3">
            <div>
              <h2
                className="
                  text-xl font-bold
                  text-slate-900
                "
              >
                {application.performer.fullName}
              </h2>

              <div
                className="
                  mt-1 flex items-center
                  gap-2 text-sm text-slate-500
                "
              >
                <Mail size={14} />

                <span>
                  {application.performer.email}
                </span>
              </div>
            </div>

            {/* BADGES */}
            <div className="flex flex-wrap gap-2">
              <div
                className={`
                  rounded-full border px-3 py-1
                  text-xs font-semibold
                  ${getStatusStyle()}
                `}
              >
                {application.status}
              </div>

              <div
                className="
                  flex items-center gap-1
                  rounded-full
                  bg-blue-100 px-3 py-1
                  text-xs font-semibold
                  text-blue-700
                "
              >
                <DollarSign size={12} />

                ${application.offered_price}
              </div>

              <div
                className="
                  flex items-center gap-1
                  rounded-full
                  bg-slate-100 px-3 py-1
                  text-xs font-medium
                  text-slate-600
                "
              >
                <Clock3 size={12} />

                {formatDate(application.applied_at)}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex gap-3">
          {application.status === "PENDING" && (
            <>
              {/* ACCEPT */}
              <button
                disabled={loading}
                onClick={handleAccept}
                className="
                  flex h-12 items-center
                  justify-center gap-2
                  rounded-2xl
                  bg-gradient-to-r
                  from-green-500 to-emerald-600
                  px-6
                  font-semibold text-white
                  shadow-lg shadow-green-200
                  transition-all
                  hover:scale-[1.03]
                  disabled:opacity-50
                "
              >
                {loading ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Check size={18} />
                )}

                Accept
              </button>

              {/* REJECT */}
              <button
                disabled={loading}
                onClick={handleReject}
                className="
                  flex h-12 items-center
                  justify-center gap-2
                  rounded-2xl
                  border border-red-200
                  bg-red-50
                  px-6
                  font-semibold text-red-600
                  transition-all
                  hover:bg-red-100
                  disabled:opacity-50
                "
              >
                <X size={18} />

                Reject
              </button>
            </>
          )}

          {application.status === "ACCEPTED" && (
            <div
              className="
                rounded-2xl bg-green-50
                px-5 py-3
                text-sm font-semibold
                text-green-700
                border border-green-200
              "
            >
              Worker Accepted
            </div>
          )}

          {application.status === "REJECTED" && (
            <div
              className="
                rounded-2xl bg-red-50
                px-5 py-3
                text-sm font-semibold
                text-red-700
                border border-red-200
              "
            >
              Application Rejected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}