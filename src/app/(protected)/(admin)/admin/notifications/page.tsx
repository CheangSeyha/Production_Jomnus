"use client";

import { useState } from "react";
import { Bell, Send, Eye, Users, ChevronRight } from "lucide-react";
import api from "@/lib/axios";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const MAX_CHARS = 500;

  const handleBroadcast = async () => {
    if (!title.trim() || !body.trim()) return;
    try {
      setSending(true);
      
      await api.post('/notifications/broadcast', {
        title: title,
        message: body,
        type: 'INFO',
        
      });
      
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setTitle("");
      setBody("");

    } catch (error) {
      console.error("Broadcast failed:", error);
      alert("Failed to send broadcast. Please try again.");
    }
      finally {
      setSending(false);
    }
  };

  const recentBroadcasts = [
    { title: "v2.4 Patch Notes Released", sent: "2 days ago", views: "8.4k" },
    { title: "Holiday Support Hours",     sent: "1 week ago", views: "12.1k" },
  ];


  return (
    <div className="min-h-screen space-y-8 max-w-[1400px] mx-auto">

      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-2 text-sm font-semibold text-slate-400">
        <span>System</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span>Communications</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-blue-600 font-extrabold">Broadcast Center</span>
      </nav>

      {/* ── Header ── */}
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Broadcast Notification
        </h1>
        <p className="text-slate-500 text-sm font-medium max-w-md leading-relaxed">
          Send urgent system-wide announcements or targeted updates to your user
          base. Messages are delivered instantly via in-app alerts.
        </p>
      </div>

      {/* ── Two-column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Compose Form ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">

            {/* Message Title */}
            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 tracking-tight">
                Message Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Scheduled Maintenance Update"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all"
              />
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 tracking-tight">
                Message Body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Write your announcement here..."
                rows={7}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-medium">
                  Rich text formatting supported
                </p>
                <p className={`text-xs font-extrabold tabular-nums ${body.length >= MAX_CHARS ? "text-red-500" : "text-slate-400"}`}>
                  {body.length} / {MAX_CHARS} characters
                </p>
              </div>
            </div>

            {/* Audience Row */}
            <div className="flex items-center justify-between bg-slate-50 rounded-2xl border border-slate-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-blue-600">Send to all users</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Broadcast will reach all active accounts
                  </p>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                <Send className="w-4 h-4" />
              </div>
            </div>

            {/* Send Button */}
            <button
              onClick={handleBroadcast}
              disabled={sending || !title.trim() || !body.trim()}
              className={`w-full py-4 rounded-2xl text-white text-sm font-extrabold uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                sent
                  ? "bg-green-500 shadow-green-200"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
              }`}
            >
              {sending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : sent ? (
                <>✓ Broadcast Sent!</>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Broadcast Notification
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── RIGHT: Sidebar ── */}
        <div className="space-y-5">

          {/* Live Desktop Preview */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-7">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-5">
              Live Desktop Preview
            </p>

            {/* Notification bubble */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4 flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-xl flex-shrink-0">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-slate-900 truncate">
                    {title || "Title Preview"}
                  </p>
                  <span className="text-xs text-slate-400 font-medium flex-shrink-0 ml-2">Now</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed line-clamp-3">
                  {body || "Your broadcast content will appear here in the user's notification center and dashboard toast alerts."}
                </p>
              </div>
            </div>
          </div>

          {/* Online Users */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-7">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                {["A", "B", "C", "D"].map((l, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 border-2 border-white flex items-center justify-center text-[10px] font-extrabold text-white"
                  >
                    {l}
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-[10px] font-extrabold text-white">
                  +2k
                </div>
              </div>
              <span className="text-sm font-extrabold text-slate-700">+2,400 users online right now</span>
            </div>
            <div className="border-l-4 border-orange-400 pl-4">
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Announcements sent during peak hours <span className="font-extrabold text-slate-700">(10AM – 2PM)</span> see{" "}
                <span className="font-extrabold text-slate-700">40% higher</span> engagement rates.
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-7">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em]">
                Recent Activity
              </p>
              <button className="text-xs font-extrabold text-blue-600 hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentBroadcasts.map((b, i) => (
                <div key={i} className="flex items-center justify-between gap-3 group">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${i === 0 ? "bg-blue-500" : "bg-slate-300"}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-slate-900 truncate">
                        {b.title}
                      </p>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        Sent {b.sent} • {b.views} views
                      </p>
                    </div>
                  </div>
                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
