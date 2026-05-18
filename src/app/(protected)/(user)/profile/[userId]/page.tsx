"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BackButton from "@/components/profile/backbutton";
import StatsManagement from "@/components/setting/StatsManagement";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";

type User = {
  id: number;
  fullName: string;
  email: string;
  profileImage?: string;
  city?: string;
  role?: string;
  bio?: string;
  requester_stats?: any;
  performer_stats?: any;
};

export default function ProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!/^\d+$/.test(userId)) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/users/profile/${userId}`);
        setUser(res.data);
        setError(false);
      } catch (err) {
        console.error("Profile Fetch Failed ->", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-xl font-black text-slate-800">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-xl font-black text-slate-800">User Not Found</p>
          <BackButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10 relative overflow-hidden">


      <div className="max-w-5xl mx-auto bg-white rounded-[36px] shadow-lg border border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="relative p-5 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50">

          <div className="flex flex-col md:flex-row items-center md:items-center gap-4">

            {/* Avatar (smaller) */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-slate-100">
                <Image
                  src={
                    user.profileImage ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`
                  }
                  alt={user.fullName}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-black text-slate-900">
                {user.fullName}
              </h1>

              <p className="text-slate-500 text-sm mt-0.5">
                {user.email}
              </p>

              <p className="text-slate-400 text-xs mt-0.5">
                📍 {user.city || "Location not set"}
              </p>

              <span className="inline-block mt-2 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">
                {user.role || "Member"}
              </span>
            </div>

            {/* Message Button */}
            <div className="flex gap-3 mt-3 md:mt-0">
              <Link href={`/messages/${user.id}`}>
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition">
                  Message
                </button>
              </Link>
            </div>

          </div>
        </div>

        {/* Body */}

        <div className="p-8 md:p-10 space-y-8">

          {/* Stats UNDER HEADER (NEW) */}
          <StatsManagement data={user} />

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Left */}
            <div className="md:col-span-2 space-y-6">

              {/* BIO */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4">
                <h2 className="text-lg font-black text-slate-900 mb-2">
                  BIO
                </h2>

                <p className="text-slate-600 leading-relaxed">
                  {user.bio ||
                    "This user hasn't shared a bio yet. They're probably busy getting things done."}
                </p>
              </div>

              {/* Back Button */}
              <BackButton />

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
