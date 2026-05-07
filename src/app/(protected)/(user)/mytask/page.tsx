"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from 'react';
import {
    Clock,
    Upload,
    Edit3
} from 'lucide-react';


export default function MyTaskPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [activeTab, setActiveTab] = useState("IN_PROGRESS");

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
        requester: {
            id: number;
            fullName: string;
            profileImage?: string | null;
        } | null;
    };

    const API_BASE_URL = (
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
    ).replace(/\/$/, "");

    const [tasks, setTasks] = useState<TaskCard[]>([]);
    const [isLoadingTasks, setIsLoadingTasks] = useState(false);
    const [proofOpenId, setProofOpenId] = useState<number | null>(null);
    const [proofType, setProofType] = useState<"TEXT" | "FILE">("TEXT");
    const [proofText, setProofText] = useState("");
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofSubmittingId, setProofSubmittingId] = useState<number | null>(null);
    const [proofError, setProofError] = useState<string | null>(null);
    const [detailsTask, setDetailsTask] = useState<TaskCard | null>(null);

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("access_token", token);

            router.replace("/dashboard");
            return;
        }

        const existingToken = localStorage.getItem("access_token");
        if (!existingToken) {
            router.replace("/auth/signin");
            return;
        }

        const loadTasks = async () => {
            try {
                setIsLoadingTasks(true);
                const res = await fetch(`${API_BASE_URL}/assignments/my`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${existingToken}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch tasks (${res.status})`);
                }

                const data: MyTaskApi[] = await res.json();
                const normalized: TaskCard[] = data
                    .filter((item) => item.task)
                    .map((item) => ({
                        assignmentId: item.assignmentId,
                        status: item.status,
                        acceptedPrice: item.acceptedPrice,
                        taskId: item.task?.id ?? 0,
                        title: item.task?.title ?? "",
                        description: item.task?.description ?? "",
                        price: item.task?.price ?? item.acceptedPrice,
                        deadline: item.task?.deadline ?? "",
                        locationText: item.task?.locationText ?? "",
                        requester: item.requester ?? null,
                    }));

                setTasks(normalized);
            } catch (error) {
                console.error("Error loading tasks:", error);
            } finally {
                setIsLoadingTasks(false);
            }
        };

        loadTasks();

    }, [router, searchParams]);

    const openProofForm = (assignmentId: number) => {
        setProofOpenId(assignmentId);
        setProofType("TEXT");
        setProofText("");
        setProofFile(null);
        setProofError(null);
    };

    const cancelProofForm = () => {
        setProofOpenId(null);
        setProofText("");
        setProofFile(null);
        setProofError(null);
    };

    const openDetails = (task: TaskCard) => {
        setDetailsTask(task);
    };

    const closeDetails = () => {
        setDetailsTask(null);
    };

    const submitProof = async (assignmentId: number) => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setProofError("You must be logged in to submit proof.");
            return;
        }

        if (proofType === "TEXT" && !proofText.trim()) {
            setProofError("Please provide proof details.");
            return;
        }

        if (proofType === "FILE" && !proofFile) {
            setProofError("Please select a file or image to upload.");
            return;
        }

        try {
            setProofSubmittingId(assignmentId);
            setProofError(null);

            const formData = new FormData();
            formData.append("assignment_id", String(assignmentId));
            formData.append("type", proofType);
            if (proofText.trim()) {
                formData.append("text_content", proofText.trim());
            }
            if (proofFile) {
                formData.append("file", proofFile);
            }

            const res = await fetch(`${API_BASE_URL}/proofs/upload`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`Failed to submit proof (${res.status})`);
            }

            setProofOpenId(null);
            setProofText("");
            setProofFile(null);
        } catch (error) {
            console.error("Error submitting proof:", error);
            setProofError("Unable to submit proof. Please try again.");
        } finally {
            setProofSubmittingId(null);
        }
    };

    const tabs = ['In Progress', 'Bidding', 'Completed', 'Drafts'];

    const normalizeStatus = (status: string) =>
        status.trim().toUpperCase().replace(/\s+/g, "_");

    const tabConfig = [
        {
            key: "IN_PROGRESS",
            label: "In Progress",
            statuses: ["IN_PROGRESS", "ASSIGNED"],
        },
        {
            key: "BIDDING",
            label: "Bidding",
            statuses: ["BIDDING", "PENDING"],
        },
        {
            key: "COMPLETED",
            label: "Completed",
            statuses: ["COMPLETED", "VERIFIED"],
        },
    ];

    const filteredTasks = tasks.filter((task) => {
        const normalized = normalizeStatus(task.status);
        const active = tabConfig.find((tab) => tab.key === activeTab);
        return active ? active.statuses.includes(normalized) : true;
    });

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-7xl mx-auto">

                {/* Navigation Tabs */}
                <div className="flex gap-8 border-b border-slate-200 mb-8">
                    {tabConfig.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`pb-4 text-sm font-bold transition-all relative ${
                                activeTab === tab.key ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {tab.label}
                            {activeTab === tab.key && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Task Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {isLoadingTasks && (
                        <div className="text-slate-500">Loading tasks...</div>
                    )}

                    {!isLoadingTasks && filteredTasks.length === 0 && (
                        <div className="text-slate-500">No tasks found for this status.</div>
                    )}

                    {!isLoadingTasks && filteredTasks.map((task) => {
                        const normalizedStatus = normalizeStatus(task.status);

                        return (
                            <div key={task.assignmentId} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">

                                {/* Content Section */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden">
                                                <img
                                                    src={
                                                        task.requester?.profileImage ||
                                                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.requester?.fullName ?? task.requester?.id ?? "unknown"}`
                                                    }
                                                    alt={task.requester?.fullName ?? "Requester"}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900">
                                                    {task.requester?.fullName ?? "Unknown requester"}
                                                </h3>
                                                <p className="text-xs text-slate-500">
                                                    Task #{task.taskId}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-blue-600">${task.price}</div>
                                            <div className="text-[10px] font-bold uppercase text-slate-400">
                                                {task.status.replace("_", " ")}
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight mb-2">
                                        {task.title}
                                    </h3>

                                    {task.description && (
                                        <p className="text-slate-600 text-sm mb-4">
                                            {task.description}
                                        </p>
                                    )}

                                    <div className="mb-6 space-y-2">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                            <Clock size={14} /> {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No deadline"}
                                        </div>
                                        <div className="text-xs font-semibold text-slate-500">
                                            {task.locationText || "No location"}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-auto flex flex-col gap-2">
                                        {normalizedStatus === 'IN_PROGRESS' || normalizedStatus === 'ASSIGNED' ? (
                                            <>
                                                <button
                                                    onClick={() => openProofForm(task.assignmentId)}
                                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                                                >
                                                    <Upload size={18} /> Upload Proof
                                                </button>
                                                <button
                                                    onClick={() => openDetails(task)}
                                                    className="w-full bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-300 transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </>
                                        ) : normalizedStatus === 'COMPLETED' || normalizedStatus === 'VERIFIED' ? (
                                            <>
                                                <button
                                                    onClick={() => openProofForm(task.assignmentId)}
                                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                                                >
                                                    <Upload size={18} /> Upload Proof
                                                </button>
                                                <button
                                                    onClick={() => openDetails(task)}
                                                    className="w-full bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-300 transition-colors"
                                                >
                                                    View Details
                                                </button>
                                            </>
                                        ) : (
                                            <button className="w-full bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-300 transition-colors">
                                                <Edit3 size={18} /> Edit Bid
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {proofOpenId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8">
                    <div className="w-full max-w-lg rounded-3xl bg-white shadow-xl overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                            <div>
                                <p className="text-lg font-bold text-slate-900">Upload Proof</p>
                                <p className="text-xs text-slate-500">Add evidence for this task</p>
                            </div>
                            <button
                                onClick={cancelProofForm}
                                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Proof Type
                                    </label>
                                    <select
                                        value={proofType}
                                        onChange={(event) =>
                                            setProofType(event.target.value as "TEXT" | "FILE")
                                        }
                                        className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="TEXT">Text</option>
                                        <option value="FILE">File / Image</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        Upload File
                                    </label>
                                    <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-3 py-4 text-xs font-semibold transition-colors ${
                                        proofType === "FILE" ? "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300" : "border-slate-200 bg-slate-50 text-slate-400"
                                    }`}>
                                        <Upload size={18} />
                                        <span>{proofFile ? "Replace file" : "Click to upload or drag & drop"}</span>
                                        <span className="text-[10px] font-medium text-slate-400">PNG, JPG, PDF up to 10MB</span>
                                        <input
                                            onChange={(event) => setProofFile(event.target.files?.[0] ?? null)}
                                            className="hidden"
                                            type="file"
                                            accept="image/*,application/pdf"
                                            disabled={proofType !== "FILE"}
                                        />
                                    </label>
                                    {proofFile && (
                                        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600">
                                            <span className="truncate">{proofFile.name}</span>
                                            <span className="text-slate-400">{Math.ceil(proofFile.size / 1024)} KB</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Proof Details
                                </label>
                                <textarea
                                    value={proofText}
                                    onChange={(event) => setProofText(event.target.value)}
                                    rows={4}
                                    className="w-full bg-white border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={proofType === "TEXT" ? "Describe what you completed, include time and outcomes" : "Notes (optional)"}
                                />
                            </div>

                            {proofError && (
                                <p className="text-xs text-red-500">{proofError}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-[11px] text-slate-400">
                                Your proof will be reviewed by the requester.
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => submitProof(proofOpenId)}
                                    disabled={proofSubmittingId === proofOpenId}
                                    className="flex-1 bg-blue-600 text-white py-2.5 px-5 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
                                >
                                    {proofSubmittingId === proofOpenId ? "Submitting..." : "Submit Proof"}
                                </button>
                                <button
                                    onClick={cancelProofForm}
                                    className="px-4 py-2.5 rounded-xl font-bold text-sm text-slate-500 hover:text-slate-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {detailsTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-8">
                    <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Task Details</p>
                                <p className="text-lg font-bold text-slate-900">{detailsTask.title}</p>
                            </div>
                        </div>
                        <div className="px-6 py-5 space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Task ID</span>
                                <span className="font-semibold text-slate-900">#{detailsTask.taskId}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Requester</span>
                                <span className="font-semibold text-slate-900">{detailsTask.requester?.fullName ?? "Unknown requester"}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Status</span>
                                <span className="font-semibold text-slate-900">{detailsTask.status.replace("_", " ")}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Price</span>
                                <span className="font-semibold text-slate-900">${detailsTask.price}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Deadline</span>
                                <span className="font-semibold text-slate-900">
                                    {detailsTask.deadline ? new Date(detailsTask.deadline).toLocaleDateString() : "No deadline"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Location</span>
                                <span className="font-semibold text-slate-900">{detailsTask.locationText || "No location"}</span>
                            </div>
                            {detailsTask.description && (
                                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Description</p>
                                    <p className="mt-2 text-slate-700 whitespace-pre-line">{detailsTask.description}</p>
                                </div>
                            )}
                        </div>
                        <div className="border-t border-slate-200 px-6 py-4">
                            <button
                                onClick={closeDetails}
                                className="w-full rounded-xl bg-blue-500 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}