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

    const [activeTab, setActiveTab] = useState('In Progress');

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


    const tabs = ['In Progress', 'Bidding', 'Completed', 'Drafts'];

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-7xl mx-auto">

                {/*/!* Navigation Tabs *!/*/}
                {/*<div className="flex gap-8 border-b border-slate-200 mb-8">*/}
                {/*    {tabs.map((tab) => (*/}
                {/*        <button*/}
                {/*            key={tab}*/}
                {/*            onClick={() => setActiveTab(tab)}*/}
                {/*            className={`pb-4 text-sm font-bold transition-all relative ${*/}
                {/*                activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'*/}
                {/*            }`}*/}
                {/*        >*/}
                {/*            {tab}*/}
                {/*            {activeTab === tab && (*/}
                {/*                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />*/}
                {/*            )}*/}
                {/*        </button>*/}
                {/*    ))}*/}
                {/*</div>*/}

                {/* Task Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {isLoadingTasks && (
                        <div className="text-slate-500">Loading tasks...</div>
                    )}

                    {!isLoadingTasks && tasks.length === 0 && (
                        <div className="text-slate-500">No assigned tasks yet.</div>
                    )}

                    {!isLoadingTasks && tasks.map((task) => (
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
                                <div className="mt-auto">
                                    {task.status === 'IN_PROGRESS' ? (
                                        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                                            <Upload size={18} /> Upload Proof
                                        </button>
                                    ) : task.status === 'COMPLETED' ? (
                                        <button className="w-full bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-300 transition-colors">
                                            View Details
                                        </button>
                                    ) : (
                                        <button className="w-full bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-300 transition-colors">
                                            <Edit3 size={18} /> Edit Bid
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
