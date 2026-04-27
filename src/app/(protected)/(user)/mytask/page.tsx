"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from 'react';
import {
    Clock,
    Upload,
    Edit3
} from 'lucide-react';


export default function DashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const token = searchParams.get("token");

        if (token) {
            localStorage.setItem("access_token", token);
            // Clean URL after saving token.
            router.replace("/dashboard");
            return;
        }

        const existingToken = localStorage.getItem("access_token");
        if (!existingToken) {
            router.replace("/auth/signin");
        }
    }, [router, searchParams]);


    const tabs = ['In Progress', 'Bidding', 'Completed', 'Drafts'];

    const activeTasks = [
        {
            id: 1,
            title: 'Deliver Birthday Cake',
            price: 25,
            due: 'Due in 45m',
            status: 'HIGH URGENCY',
            progress: 80,
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400',
            type: 'in-progress'
        },
        {
            id: 2,
            title: 'Queue for Cinema Ticket',
            price: 15,
            due: 'Due in 2h',
            status: 'NORMAL',
            tags: ['Entertainment', 'Manual Task'],
            image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=400',
            type: 'view-details'
        },
    ];

    const [activeTab, setActiveTab] = useState('In Progress');

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">

                {/* Navigation Tabs */}
                <div className="flex gap-8 border-b border-slate-200 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-sm font-bold transition-all relative ${
                                activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Task Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeTasks.map((task) => (
                        <div key={task.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">

                            {/* Image Section */}
                            <div className="relative h-48 w-full">
                                <img src={task.image} alt={task.title} className="w-full h-full object-cover" />
                                <div className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-[10px] font-black text-white uppercase tracking-wider ${
                                    task.status === 'HIGH URGENCY' || task.status === 'URGENT' ? 'bg-red-600' :
                                        task.status === 'BIDDING' ? 'bg-orange-500' : 'bg-blue-600'
                                }`}>
                                    {task.status}
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight flex-1">{task.title}</h3>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-blue-600">${task.price}</div>
                                    </div>
                                </div>

                                {/* Sub-info based on type */}
                                <div className="mb-6 space-y-2">
                                    {task.due && (
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                            <Clock size={14} /> {task.due}
                                        </div>
                                    )}
                                    {task.tags && (
                                        <div className="flex gap-2">
                                            {task.tags.map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-500">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Progress Bar for specific tasks */}
                                {task.progress && (
                                    <div className="mb-6">
                                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-1">
                                            <span>Delivery Status</span>
                                            <span>{task.progress}% Complete</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 rounded-full" style={{ width: `${task.progress}%` }} />
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="mt-auto">
                                    {task.type === 'in-progress' || task.type === 'urgent-action' ? (
                                        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                                            <Upload size={18} /> Upload Proof
                                        </button>
                                    ) : task.type === 'view-details' ? (
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
