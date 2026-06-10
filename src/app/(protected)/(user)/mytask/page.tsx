"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {Clock, Upload, Play, MapPin, X, CheckCircle2, MessageCircle} from "lucide-react";
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
  assignmentId?: number;
  applicationId?: number;

  status: string;

  acceptedPrice?: number;
  offeredPrice?: number;

  taskId: number;

  title: string;
  description: string;

  price: number;
  deadline: string;

  locationText: string;

  requester: {
    id: number;
    fullName: string;
    profileImage?: string | null;
  } | null;
};

type MyApplicationApi = {
  applicationId: number;
  status: string;
  offeredPrice: number;

  task: {
    id: number;
    title: string;
    description?: string | null;
    deadline: string;
    locationText?: string | null;
    latitude?: number;
    longitude?: number;
  };

  requester: {
    id: number;
    fullName: string;
    profileImage?: string | null;
  };

  appliedAt: string;
};

const TAB_CONFIG = [
    { key: "ASSIGNED",    label: "Accepted",    statuses: ["ASSIGNED"] },
    { key: "IN_PROGRESS", label: "In Progress", statuses: ["IN_PROGRESS"] },
    { key: "COMPLETED",   label: "Completed",   statuses: ["COMPLETED", "VERIFIED"] },
    { key: "BIDDING",     label: "Bidding",     statuses: ["BIDDING", "PENDING"] },
];

function Avatar({ name, image, size = "md" }: { name?: string | null; image?: string | null; size?: "sm" | "md" }) {
    const dim = size === "sm" ? "w-8 h-8 text-xs" : "w-11 h-11 text-sm";

    if (image)
        return (
            <img
                src={image}
                alt={name ?? ""}
                className={`${dim} rounded-xl object-cover ring-2 ring-sky-100`}
            />
        );

    return (
        <div className={`${dim} rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 font-bold`}>
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


    const load = async () => {
    try {
        setIsLoading(true);

        const [assignmentRes, applicationRes] =
        await Promise.all([
            api.get<MyTaskApi[]>("/assignments/my"),
            api.get<MyApplicationApi[]>("/applications/me"),
        ]);

        const assignmentTasks: TaskCard[] =
        assignmentRes.data
            .filter((i) => i.task)
            .map((i) => ({
            assignmentId: i.assignmentId,

            status: i.status,

            acceptedPrice: i.acceptedPrice,

            taskId: i.task?.id ?? 0,
            title: i.task?.title ?? "",
            description: i.task?.description ?? "",

            price:
                i.task?.price ?? i.acceptedPrice,

            deadline:
                i.task?.deadline ?? "",

            locationText:
                i.task?.locationText ?? "",

            requester:
                i.requester ?? null,
            }));

        const applicationTasks: TaskCard[] =
        applicationRes.data
            .filter((i) => i.task)
            .map((i) => ({
            applicationId: i.applicationId,

            status: i.status,

            offeredPrice: i.offeredPrice,

            taskId: i.task.id,

            title: i.task.title,
            description:
                i.task.description ?? "",

            price: i.offeredPrice,

            deadline:
                i.task.deadline ?? "",

            locationText:
                i.task.locationText ?? "",

            requester:
                i.requester ?? null,
            }));

        setTasks([
        ...assignmentTasks,
        ...applicationTasks,
        ]);

    } catch (e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
    };

    useEffect(() => {
        load();
    }, []);

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

            setTasks((prev) =>
                prev.map((t) =>
                    t.assignmentId === assignmentId ? { ...t, status: "IN_PROGRESS" } : t
                )
            );

            setActiveTab("IN_PROGRESS");

        } catch (e) { console.error(e); }
    };

    const openProof = (id: number) => { setProofOpenId(id); setProofType("TEXT"); setProofText(""); setProofFile(null); setProofError(null); };
    const closeProof = () => { setProofOpenId(null); setProofText(""); setProofFile(null); setProofError(null); };


    const startConversation = async (e: React.MouseEvent, taskId: number) => {
        e.stopPropagation();
        try {
            const { data } = await api.post("/conversations", { taskId });
            router.push(`/message?conversationId=${data.id}`);
        } catch (err) {
            console.error("Failed to start conversation:", err);
        }
    };


    const submitProof = async (assignmentId: number) => {

        if (
            proofType === "TEXT" && !proofText.trim()) {
            setProofError("Please provide proof details.");
            return;
        }
        if (
            proofType === "FILE" && !proofFile) {
            setProofError("Please select a file.");
            return;
        }

        try {
            setProofSubmittingId(assignmentId);
            setProofError(null);

            const fd = new FormData();
            fd.append("assignment_id", String(assignmentId));
            fd.append("type", proofType);

            if (
                proofText.trim()) fd.append("text_content", proofText.trim()
            );
            if (
                proofFile) fd.append("file", proofFile
            );

            await api.post("/proofs/upload", fd);

            closeProof();

            setTasks((prev) => prev.map((t) => t.assignmentId === assignmentId ? { ...t, status: "COMPLETED" } : t));

            setActiveTab("COMPLETED");

        } catch (e) {
            console.error(e); setProofError("Unable to submit proof. Please try again.");
        } finally {
            setProofSubmittingId(null);
        }
    };


    return (

        <div className="h-full min-h-0 overflow-hidden">

            <div className="mx-auto flex h-full max-w-[1800px] flex-col gap-5 overflow-hidden px-4 py-4 md:px-8">

                <div className="flex items-end justify-between gap-4 shrink-0">

                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-950 tracking-tight">My Tasks</h1>
                    </div>

                    <div className="rounded-2xl border border-sky-200 bg-white/85 px-4 py-2 text-right shadow-sm">

                        <p className="text-2xl font-black leading-none text-sky-600">{tasks.length}</p>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                            {tasks.length === 1 ? "task" : "tasks"}
                        </p>

                    </div>

                </div>


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
                                    }`}>{count}</span>
                                )}

                            </button>
                        );
                    })}

                </div>

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
                        const daysLeft = Math.ceil(
                            (deadlineDate.getTime() - Date.now()) / 86400000
                        );

                        const isUrgent =
                            daysLeft <= 3 && daysLeft >= 0;

                        return (
                            <article
                                key={
                                    task.assignmentId
                                        ? `assignment-${task.assignmentId}`
                                        : `application-${task.applicationId}`
                                }
                                onClick={() => {
                                    if (!task.assignmentId) return;

                                    router.push(
                                        `/mytask/${task.assignmentId}`
                                    );
                                }}
                                className="group cursor-pointer rounded-2xl border border-sky-100 bg-white shadow-[0_8px_28px_rgba(14,165,233,0.08)] transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_18px_40px_rgba(14,165,233,0.18)] flex flex-col overflow-hidden"
                            >
                                <div className="p-5 flex flex-col flex-1 gap-4">

                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-3">

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();

                                                if (task.requester?.id) {
                                                    router.push(
                                                        `/profile/${task.requester.id}`
                                                    );
                                                }
                                            }}
                                            className="flex items-center gap-3 min-w-0 group/profile"
                                        >
                                            <Avatar
                                                name={task.requester?.fullName}
                                                image={task.requester?.profileImage}
                                            />

                                            <div className="text-left min-w-0">
                                                <p className="text-sm font-semibold text-slate-800 truncate group-hover/profile:text-sky-700 transition-colors">
                                                    {task.requester?.fullName ??
                                                        "Unknown"}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    TASK: {task.title}
                                                </p>
                                            </div>
                                        </button>

                                        <div className="shrink-0 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-right">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                                                Budget
                                            </p>

                                            <p className="text-xl font-black text-emerald-700 leading-none">
                                                ${task.price}
                                            </p>
                                        </div>

                                    </div>

                                    {/* Title */}
                                    <div>

                                        <h3 className="font-bold text-slate-950 text-base leading-snug line-clamp-2 group-hover:text-sky-700 transition-colors">
                                            {task.title}
                                        </h3>

                                        {task.description && (
                                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                                                {task.description}
                                            </p>
                                        )}

                                    </div>

                                    {/* Meta */}
                                    <div className="flex flex-wrap gap-2">

                                        {task.locationText && (
                                            <span className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800">
                                                <MapPin
                                                    size={11}
                                                    className="text-sky-500 shrink-0"
                                                />

                                                <span className="truncate max-w-[140px]">
                                                    {task.locationText}
                                                </span>
                                            </span>
                                        )}

                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                                                isUrgent
                                                    ? "bg-rose-50 border-rose-200 text-rose-700"
                                                    : "bg-indigo-50 border-indigo-200 text-indigo-700"
                                            }`}
                                        >
                                            <Clock
                                                size={11}
                                                className={
                                                    isUrgent
                                                        ? "text-rose-500"
                                                        : "text-indigo-500"
                                                }
                                            />

                                            {task.deadline
                                                ? isUrgent
                                                    ? `${daysLeft}d left!`
                                                    : deadlineDate.toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            month: "short",
                                                            day: "numeric",
                                                        }
                                                    )
                                                : "No deadline"}
                                        </span>

                                        <StatusBadge status={task.status} />

                                    </div>

                                    {/* Actions */}
                                    <div className="mt-auto flex flex-col gap-2 pt-1">

                                        {task.assignmentId &&
                                            ns === "ASSIGNED" && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        startWork(
                                                            task.assignmentId!
                                                        );
                                                    }}
                                                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors shadow-sm shadow-sky-200"
                                                >
                                                    Start Working
                                                </button>
                                            )}

                                        {task.assignmentId &&
                                            ns === "IN_PROGRESS" && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openProof(
                                                            task.assignmentId!
                                                        );
                                                    }}
                                                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold transition-colors shadow-sm shadow-sky-200"
                                                >
                                                    Upload Proof
                                                </button>
                                            )}

                                        {task.assignmentId &&
                                            (
                                                ns === "ASSIGNED" ||
                                                ns === "IN_PROGRESS" ||
                                                ns === "COMPLETED" ||
                                                ns === "VERIFIED"
                                            ) && (
                                                <button
                                                    onClick={(e) =>
                                                        startConversation(
                                                            e,
                                                            task.taskId
                                                        )
                                                    }
                                                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-700 text-sm font-bold transition-colors"
                                                >
                                                    <MessageCircle size={15} />
                                                    Message Requester
                                                </button>
                                            )}

                                            {task.assignmentId && (
                                                <button
                                                    onClick={() => {
                                                        if (!task.assignmentId) return;

                                                        router.push(
                                                            `/mytask/${task.assignmentId}`
                                                        );
                                                    }}
                                                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-sm font-bold transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            )}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

                    <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">

                        {/* Header */}
                        <div className="px-6 py-5 bg-gradient-to-r from-sky-50 to-white border-b border-slate-100">

                            <p className="text-xs font-semibold tracking-widest text-sky-600 uppercase">
                                Submission
                            </p>

                            <h2 className="text-lg font-bold text-slate-900">
                                Upload Proof of Work
                            </h2>

                            <p className="text-xs text-slate-500 mt-1">
                                Provide evidence for task completion
                            </p>

                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-5">

                            {/* Proof Type */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Proof Type
                                </label>

                                <div className="grid grid-cols-2 gap-2">

                                    {["TEXT", "FILE"].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setProofType(type as "TEXT" | "FILE")}
                                            className={`px-3 py-2 rounded-xl text-sm font-semibold border transition ${
                                                proofType === type
                                                    ? "bg-sky-600 text-white border-sky-600"
                                                    : "bg-white text-slate-600 border-slate-200 hover:border-sky-300"
                                            }`}
                                        >
                                            {type === "TEXT" ? "Text" : "File"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* File Upload */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Upload File
                                </label>

                                <label className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 cursor-pointer transition ${
                                    proofType === "FILE"
                                        ? "border-sky-400 bg-sky-50 hover:bg-sky-100"
                                        : "border-slate-200 bg-slate-50 opacity-50 pointer-events-none"
                                }`}>
                                    <Upload className="text-sky-600" size={18} />

                                    <span className="text-sm font-medium text-slate-600 text-center"
                                    >{proofFile ? proofFile.name : "Click to upload image or PDF"}
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        disabled={proofType !== "FILE"}
                                        onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                                        className="hidden"
                                    />

                                </label>

                            </div>

                            {/* Text Area */}<div className="space-y-2">

                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Description
                                </label>

                                <textarea
                                    value={proofText}
                                    onChange={(e) => setProofText(e.target.value)}
                                    rows={4}
                                    placeholder={
                                        proofType === "TEXT"
                                            ? "Explain what you completed..."
                                            : "Optional notes..."
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400"
                                />
                            </div>

                            {/* Error */}
                            {proofError && (
                                <div className="text-sm text-red-600 font-medium bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
                                    {proofError}
                                </div>
                            )}

                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">

                            <p className="text-xs text-slate-500">
                                Submitted proof will be reviewed before approval
                            </p>

                            <div className="flex gap-2">
                                <button
                                    onClick={closeProof}
                                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => proofOpenId && submitProof(proofOpenId)}
                                    disabled={proofSubmittingId === proofOpenId}
                                    className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {proofSubmittingId === proofOpenId ? "Submitting..." : "Submit"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}