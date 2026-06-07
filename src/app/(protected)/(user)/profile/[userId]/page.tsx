"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Mail, Phone, ArrowLeft, MessageCircle, ShieldCheck, User, Calendar, CheckCircle2 } from "lucide-react";
import api from "@/lib/axios";
import StatsManagement from "@/components/setting/StatsManagement";
import WorkHistory from "@/components/setting/WorkHistory";

type User = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  city?: string;
  role?: string;
  currentRole?: string;
  bio?: string;
  isIdentityVerified?: boolean;
  createdAt?: string;
  requester_stats?: any;
  performer_stats?: any;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
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

  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchWorkHistory = async () => {
      try {
        const res = await api.get(`/assignments/work-history/${userId}`);
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch work history", err);
      }
    };
    fetchWorkHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-500 animate-spin" />
          <p className="text-sm text-slate-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto">
            <User className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-xl font-black text-slate-800">User not found</p>
          <p className="text-sm text-slate-400">This profile doesn't exist or has been removed.</p>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Go back
          </button>
        </div>
      </div>
    );
  }

  const role = user.currentRole || user.role;
  const joinedYear = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : null;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 bg-white border border-sky-200 bg-white/90 shadow-[0_14px_40px_rgba(14,165,233,0.12)] backdrop-blur px-4 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Main card */}
        <div className="bg-white rounded-3xl border border-sky-200 whoverflow-hidden">

          {/* Hero */}
          <div className="p-8 flex flex-col sm:flex-row gap-6 items-start border-b border-slate-100">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-blue-100 border border-slate-200 flex items-center justify-center">
                {user.profileImage ? (
                  <Image
                    src={user.profileImage}
                    alt={user.fullName}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-black text-blue-700">
                    {getInitials(user.fullName)}
                  </span>
                )}
              </div>
              {/* Online dot */}
              <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {user.fullName}
                </h1>
                {user.isIdentityVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <span className="flex items-center gap-1.5 text-sm text-slate-500 text-blue-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {user.email}
                </span>
                {user.phone && (
                  <span className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {user.phone}
                  </span>
                )}
                {user.city && (
                  <span className="flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {user.city}
                  </span>
                )}
              </div>

              {role && (
                <span className="inline-block text-xs font-bold uppercase tracking-widest bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                  {role} mode
                </span>
              )}
            </div>

            {/* Message */}
            {/* <Link href={`/messages/${user.id}`} className="shrink-0">
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors">
                <MessageCircle className="w-4 h-4" /> Message
              </button>
            </Link> */}
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_260px]">

            {/* Left — stats + bio */}
            <div className="p-8 space-y-8 border-b md:border-b-0 md:border-r border-slate-100">

              {/* Stats */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-4">Performance</p>
                <StatsManagement data={user} />
              </div>

              {/* Bio */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-2">About</p>
                <h2 className="font-black text-lg text-slate-900 mb-3">Bio</h2>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {user.bio || "This user hasn't shared a bio yet."}
                </p>
              </div>
            </div>

            {/* Right — contact sidebar */}
            <div className="p-8 space-y-6">

              {/* Contact */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-3">Contact</p>
                <div className="space-y-0 divide-y divide-slate-100">
                  <div className="flex items-center gap-3 py-3 text-sm text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3 py-3 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      {user.phone}
                    </div>
                  )}
                  {user.city && (
                    <div className="flex items-center gap-3 py-3 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      {user.city}
                    </div>
                  )}
                </div>
              </div>

              {/* Account */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-3">Account</p>
                <div className="space-y-0 divide-y divide-slate-100">
                  {user.isIdentityVerified && (
                    <div className="flex items-center gap-3 py-3 text-sm text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      Identity verified
                    </div>
                  )}
                  {role && (
                    <div className="flex items-center gap-3 py-3 text-sm text-slate-600">
                      <User className="w-4 h-4 text-slate-400 shrink-0" />
                      {role} role
                    </div>
                  )}
                  {joinedYear && (
                    <div className="flex items-center gap-3 py-3 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      Joined {joinedYear}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Work History — outside grid, full width */}
          <div className="p-8 border-t border-sky-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-1">History</p>
                <h3 className="font-black text-xl text-slate-950">Work History</h3>
                <p className="text-xs text-slate-400 mt-1">Completed tasks on Jomnus.</p>
              </div>
            </div>
            <WorkHistory data={projects} setData={setProjects} />
          </div>
        </div>
      </div>
    </div>
  );
}