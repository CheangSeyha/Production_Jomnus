"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, Upload, Play, MapPin, X, CheckCircle2 } from "lucide-react";
import api from "@/lib/axios";

type MyTaskApi = {
    assignmentId: number;
    status: string;
    acceptedPrice: number;
    task: {
        id: number;
        title: string;
        description?: string | null;
        price: number;
        deadline: string;
        locationText?: string | null;
    } | null;
    requester: {
        id: number;
        fullName: string;
        profileImage?: string | null;
    } | null;
};

type TaskCard = {
    assignmentId: number;
    status: string;
    acceptedPrice: number;
    taskId: number;
    title: string;
    description: string;
    price: number;
    deadline: string;
    locationText: string;
    requester: { id: number; fullName: string; profileImage?: string | null } | null;
};

const TAB_CONFIG = [
    { key: "ASSIGNED",    label: "Accepted",    statuses: ["ASSIGNED"] },
    { key: "IN_PROGRESS", label: "In Progress", statuses: ["IN_PROGRESS"] },
    { key: "COMPLETED",   label: "Completed",   statuses: ["COMPLETED", "VERIFIED"] },
    { key: "BIDDING",     label: "Bidding",     statuses: ["BIDDING", "PENDING"] },
];

function Avatar({ name, image, size = "md" }: { name?: string | null; image?: string | null; size?: "sm" | "md" }) {
    const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-11 h-11 text-sm";
    if (image) return <img src={image} alt={name ?? ""} className={`${dim} rounded-xl object-cover ring-2 ring-sky-100`} />;
    return (
        <div className={`${dim} rounded-xl bg-sky-100 border border-sky-200 ring-2 ring-sky-100 flex items-center justify-center text-sky-700 font-bold`}>
            {(name ?? "?").charAt(0).toUpperCase()}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const s = status.trim().toUpperCase().replace(/\s+/g, "_");
    const map: Record<string, string> = {
        ASSIGNED:    "bg-sky-50 border-sky-200 text-sky-700",
        IN_PROGRESS: "bg-amber-50 border-amber-200 text-amber-700",
        COMPLETED:   "bg-emerald-50 border-emerald-200 text-emerald-700",
        VERIFIED:    "bg-emerald-50 border-emerald-200 text-emerald-700",
        BIDDING:     "bg-indigo-50 border-indigo-200 text-indigo-700",
        PENDING:     "bg-indigo-50 border-indigo-200 text-indigo-700",
    };
    return (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${map[s] ?? "bg-slate-50 border-slate-200 text-slate-600"}`}>
      {status.replace(/_/g, " ")}
    </span>
    );
}

export default function MyTaskPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState("ASSIGNED");
    const [tasks, setTasks] = useState<TaskCard[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [proofOpenId, setProofOpenId] = useState<number | null>(null);
    const [proofType, setProofType] = useState<"TEXT" | "FILE">("TEXT");
    const [proofText, setProofText] = useState("");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofSubmittingId, setProofSubmittingId] = useState<number | null>(null);
    const [proofError, setProofError] = useState<string | null>(null);
    const [detailsTask, setDetailsTask] = useState<TaskCard | null>(null);

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) { localStorage.setItem("access_token", token); router.replace("/dashboard"); return; }
        if (!localStorage.getItem("access_token")) { router.replace("/auth/signin"); return; }

        const load = async () => {
            try {
                setIsLoading(true);
                const { data } = await api.get<MyTaskApi[]>("/assignments/my");
                setTasks(
                    data.filter((i) => i.task).map((i) => ({
                        assignmentId: i.assignmentId,
                        status: i.status,
                        acceptedPrice: i.acceptedPrice,
                        taskId: i.task?.id ?? 0,
                        title: i.task?.title ?? "",
                        description: i.task?.description ?? "",
                        price: i.task?.price ?? i.acceptedPrice,
                        deadline: i.task?.deadline ?? "",
                        locationText: i.task?.locationText ?? "",
                        requester: i.requester ?? null,
                    }))
                );
            } catch (e) { console.error(e); }
            finally { setIsLoading(false); }
        };
        load();
    }, [router, searchParams]);

    const normalizeStatus = (s: string) => s.trim().toUpperCase().replace(/\s+/g, "_");

    const filteredTasks = tasks.filter((t) => {
        const active = TAB_CONFIG.find((tab) => tab.key === activeTab);
        return active ? active.statuses.includes(normalizeStatus(t.status)) : true;
    });

    const tabCount = (key: string) => {
        const tab = TAB_CONFIG.find((t) => t.key === key);
        return tasks.filter((t) => tab?.statuses.includes(normalizeStatus(t.status))).length;
    };

    const startWork = async (assignmentId: number) => {
        try {
            await api.patch(`/assignments/${assignmentId}/start`);
            setTasks((prev) => prev.map((t) => t.assignmentId === assignmentId ? { ...t, status: "IN_PROGRESS" } : t));
            setActiveTab("IN_PROGRESS");
        } catch (e) { console.error(e); }
    };

    const openProof = (id: number) => { setProofOpenId(id); setProofType("TEXT"); setProofText(""); setProofFile(null); setProofError(null); };
    const closeProof = () => { setProofOpenId(null); setProofText(""); setProofFile(null); setProofError(null); };

    const submitProof = async (assignmentId: number) => {
        if (proofType === "TEXT" && !proofText.trim()) { setProofError("Please provide proof details."); return; }
        if (proofType === "FILE" && !proofFile) { setProofError("Please select a file."); return; }
        try {
            setProofSubmittingId(assignmentId);
            setProofError(null);
            const fd = new FormData();
            fd.append("assignment_id", String(assignmentId));
            fd.append("type", proofType);
            if (proofText.trim()) fd.append("text_content", proofText.trim());
            if (proofFile) fd.append("file", proofFile);
            await api.post("/proofs/upload", fd);
            closeProof();
            setTasks((prev) => prev.map((t) => t.assignmentId === assignmentId ? { ...t, status: "COMPLETED" } : t));
            setActiveTab("COMPLETED");
        } catch (e) { console.error(e); setProofError("Unable to submit proof. Please try again."); }
        finally { setProofSubmittingId(null); }
    };

    return (
        <div className="h-full min-h-0 overflow-hidden">
            <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-5 overflow-hidden px-4 py-4 md:px-8">

                {/* ── PAGE HEADER ── */}
                <div className="flex items-end justify-between gap-4 shrink-0">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-1">Performer</p>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">My Tasks</h1>
                    </div>
                    <div className="rounded-2xl border border-sky-200 bg-white/85 px-4 py-2 text-right shadow-sm">
                        <p className="text-2xl font-black leading-none text-sky-600">{tasks.length}</p>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                            {tasks.length === 1 ? "task" : "tasks"}
                        </p>
                    </div>
                </div>

                {/* ── TABS ── */}
                <div className="shrink-0 flex gap-1 rounded-2xl border border-sky-200 bg-white/90 p-1.5 shadow-sm w-fit">
                    {TAB_CONFIG.map((tab) => {
                        const count = tabCount(tab.key);
                        const isActive = activeTab === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
                                    isActive
                                        ? "bg-sky-600 text-white shadow-sm"
                                        : "text-slate-500 hover:bg-sky-50 hover:text-sky-700"
                                }`}
                            >
                                {tab.label}
                                {count > 0 && (
                                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${
                                        isActive ? "bg-white/20 text-white" : "bg-sky-100 text-sky-700"
                                    }`}>
                    {count}
                  </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* ── TASK GRID ── */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                    {isLoading && (
                        <div className="flex h-40 items-center justify-center text-slate-400 text-sm">
                            Loading tasks…
                        </div>
                    )}

                    {!isLoading && filteredTasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-sky-200 bg-white/85 text-center">
                            <div className="text-3xl mb-3">📋</div>
                            <p className="font-semibold text-slate-800">No tasks here</p>
                            <p className="text-sm text-slate-500 mt-1">Tasks in this status will appear here</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-6">
                        {!isLoading && filteredTasks.map((task) => {
                            const ns = normalizeStatus(task.status);
                            const deadlineDate = new Date(task.deadline);
                            const daysLeft = Math.ceil((deadlineDate.getTime() - Date.now()) / 86400000);
                            const isUrgent = daysLeft <= 3 && daysLeft >= 0;

                            return (
                                <article
                                    key={task.assignmentId}
                                    onClick={() => router.push(`/mytask/${task.assignmentId}`)}
                                    className="group cursor-pointer rounded-2xl border border-sky-100 bg-white shadow-[0_8px_28px_rgba(14,165,233,0.08)] transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_18px_40px_rgba(14,165,233,0.18)] flex flex-col overflow-hidden"
                                >
                                    <div className="p-5 flex flex-col flex-1 gap-4">

                                        {/* Header */}
                                        <div className="flex items-start justify-between gap-3">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); if (task.requester?.id) router.push(`/profile/${task.requester.id}`); }}
                                                className="flex items-center gap-3 min-w-0 group/profile"
                                            >
                                                <Avatar name={task.requester?.fullName} image={task.requester?.profileImage} />
                                                <div className="text-left min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 truncate group-hover/profile:text-sky-700 transition-colors">
                                                        {task.requester?.fullName ?? "Unknown"}
                                                    </p>
                                                    <p className="text-xs text-slate-400">Task #{task.taskId}</p>
                                                </div>
                                            </button>
                                            <div className="shrink-0 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-right">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Budget</p>
                                                <p className="text-xl font-black text-emerald-700 leading-none">${task.price}</p>
                                            </div>
                                        </div>

                                        {/* Title + description */}
                                        <div>
                                            <h3 className="font-bold text-slate-950 text-base leading-snug line-clamp-2 group-hover:text-sky-700 transition-colors">
                                                {task.title}
                                            </h3>
                                            {task.description && (
                                                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                                            )}
                                        </div>

                                        {/* Meta */}
                                        <div className="flex flex-wrap gap-2">
                                            {task.locationText && (
                                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800">
                          <MapPin size={11} className="text-sky-500 shrink-0" />
                          <span className="truncate max-w-[140px]">{task.locationText}</span>
                        </span>
                                            )}
                                            <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                                                isUrgent ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-indigo-50 border-indigo-200 text-indigo-700"
                                            }`}>
                        <Clock size={11} className={isUrgent ? "text-rose-500" : "text-indigo-500"} />
                                                {task.deadline ? (isUrgent ? `${daysLeft}d left!` : deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })) : "No deadline"}
                      </span>
                                            <StatusBadge status={task.status} />
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-auto flex flex-col gap-2 pt-1">
                                            {ns === "ASSIGNED" && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); startWork(task.assignmentId); }}
                                                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors shadow-sm shadow-sky-200"
                                                >
                                                    <Play size={15} /> Start Working
                                                </button>
                                            )}

                                            {ns === "IN_PROGRESS" && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); openProof(task.assignmentId); }}
                                                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors shadow-sm shadow-sky-200"
                                                >
                                                    <Upload size={15} /> Upload Proof
                                                </button>
                                            )}

                                            {(ns === "COMPLETED" || ns === "VERIFIED") && (
                                                // ✅ Show only View Details for completed — no upload proof
                                                <div className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                                                    <CheckCircle2 size={14} /> Work Submitted
                                                </div>
                                            )}

                                            {/* View Details — shown for all statuses */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setDetailsTask(task); }}
                                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-sky-200 bg-white hover:bg-sky-50 text-sky-700 text-sm font-bold transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </div>

                                    </div>

                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── PROOF MODAL ── */}
            {proofOpenId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white border border-sky-100 shadow-[0_18px_45px_rgba(14,165,233,0.18)] overflow-hidden">
                        <div className="flex items-center justify-between border-b border-sky-100 px-6 py-4 bg-sky-50/60">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-sky-600">Proof</p>
                                <p className="text-base font-black text-slate-900">Upload Proof of Work</p>
                            </div>
                            <button onClick={closeProof} className="rounded-xl border border-sky-200 p-1.5 text-slate-400 hover:bg-sky-100 hover:text-sky-700 transition">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Proof Type</label>
                                    <select
                                        value={proofType}
                                        onChange={(e) => setProofType(e.target.value as "TEXT" | "FILE")}
                                        className="w-full rounded-xl border border-sky-200 bg-sky-50/70 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-200/80"
                                    >
                                        <option value="TEXT">Text</option>
                                        <option value="FILE">File / Image</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Upload File</label>
                                    <label className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-3 py-3 text-xs font-semibold transition-colors ${
                                        proofType === "FILE" ? "border-sky-300 bg-sky-50 text-sky-700 hover:border-sky-400" : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                                    }`}>
                                        <Upload size={16} />
                                        <span>{proofFile ? proofFile.name : "Click to upload"}</span>
                                        <input onChange={(e) => setProofFile(e.target.files?.[0] ?? null)} className="hidden" type="file" accept="image/*,application/pdf" disabled={proofType !== "FILE"} />
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Proof Details</label>
                                <textarea
                                    value={proofText}
                                    onChange={(e) => setProofText(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-xl border border-sky-200 bg-sky-50/70 py-2.5 px-3 text-sm text-slate-700 focus:outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-200/80"
                                    placeholder={proofType === "TEXT" ? "Describe what you completed…" : "Notes (optional)"}
                                />
                            </div>

                            {proofError && <p className="text-xs font-semibold text-rose-600">{proofError}</p>}
                        </div>

                        <div className="flex items-center justify-between gap-3 border-t border-sky-100 px-6 py-4">
                            <p className="text-xs text-slate-400">Reviewed by the requester after submission.</p>
                            <div className="flex gap-2">
                                <button onClick={closeProof} className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-700 transition">
                                    Cancel
                                </button>
                                <button
                                    onClick={() => proofOpenId && submitProof(proofOpenId)}
                                    disabled={proofSubmittingId === proofOpenId}
                                    className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {proofSubmittingId === proofOpenId ? "Submitting…" : "Submit Proof"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── DETAILS MODAL ── */}
            {detailsTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white border border-sky-100 shadow-[0_18px_45px_rgba(14,165,233,0.18)] overflow-hidden">
                        <div className="flex items-center justify-between border-b border-sky-100 px-6 py-4 bg-sky-50/60">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-sky-600">Task Details</p>
                                <p className="text-base font-black text-slate-900">{detailsTask.title}</p>
                            </div>
                        </div>
                        <div className="px-6 py-5 space-y-3 text-sm">
                            {[
                                ["Task ID", `#${detailsTask.taskId}`],
                                ["Requester", detailsTask.requester?.fullName ?? "Unknown"],
                                ["Status", detailsTask.status.replace(/_/g, " ")],
                                ["Price", `$${detailsTask.price}`],
                                ["Deadline", detailsTask.deadline ? new Date(detailsTask.deadline).toLocaleDateString() : "No deadline"],
                                ["Location", detailsTask.locationText || "No location"],
                            ].map(([label, value]) => (
                                <div key={label} className="flex items-center justify-between">
                                    <span className="text-slate-400 font-medium">{label}</span>
                                    <span className="font-semibold text-slate-900">{value}</span>
                                </div>
                            ))}
                            {detailsTask.description && (
                                <div className="rounded-xl border border-sky-100 bg-sky-50/60 px-4 py-3 mt-2">
                                    <p className="text-xs font-bold uppercase tracking-widest text-sky-500 mb-1.5">Description</p>
                                    <p className="text-slate-700 text-sm whitespace-pre-line">{detailsTask.description}</p>
                                </div>
                            )}
                        </div>
                        <div className="border-t border-sky-100 px-6 py-4">
                            <button onClick={() => setDetailsTask(null)} className="w-full rounded-xl bg-sky-600 hover:bg-sky-700 py-2.5 text-sm font-bold text-white transition">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}