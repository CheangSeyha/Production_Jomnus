"use client";

import { useState } from "react";
import { Bell, Send, Info } from "lucide-react";
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
      
      // Still sending title/message; audience/type removed as requested
      await api.post('/notifications/broadcast', {
        title: title,
        message: body,
      });
      
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setTitle("");
      setBody("");

    } catch (error) {
      console.error(error);
      alert("Failed to send broadcast. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen space-y-8 max-w-[1400px] mx-auto">
      <div className="space-y-1">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Broadcast Notification
        </h1>
        <p className="text-slate-500 text-sm font-medium max-w-md leading-relaxed">
          Send urgent system-wide announcements to your user base. Messages are delivered instantly via in-app alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
            
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

            <div className="space-y-2">
              <label className="text-sm font-extrabold text-slate-700 tracking-tight">
                Message Body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value.slice(0, MAX_CHARS))}
                placeholder="Write your announcement here..."
                rows={5}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all resize-none"
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-medium">
                  Plain text broadcast to in-app notification center.
                </p>
                <p className={`text-xs font-extrabold tabular-nums ${body.length >= MAX_CHARS ? "text-red-500" : "text-slate-400"}`}>
                  {body.length} / {MAX_CHARS}
                </p>
              </div>
            </div>

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
                  Send Broadcast
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-7">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.2em] mb-5">
              Live Desktop Preview
            </p>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4 flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-xl flex-shrink-0 border border-blue-100">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-slate-900 truncate">
                    {title || "Title Preview"}
                  </p>
                  <span className="text-xs text-slate-400 font-medium flex-shrink-0 ml-2">Now</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed break-words">
                  {body || "Your broadcast content will appear here in the user's notification center."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}