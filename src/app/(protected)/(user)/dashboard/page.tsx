"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import React from 'react';
import {
    MapPin,
    Clock,
    Info,
    SlidersHorizontal
} from 'lucide-react';

type Category = {
  id: number;
  name: string;
  description?: string;
};

type Task = {
    id: number;
    title: string;
    description: string;
    locationText?: string;
    price: number;
    createdAt: string;
    deadline: string;
    priority: "Urgent" | "Normal" | "Low";
    requesterName: string;
    requestCount: number;
};


const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
).replace(/\/$/, "");

export default function DashboardPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    const [tasks, setTasks] = useState<Task[]>([]);

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

        const loadTasks = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const res = await fetch(`${API_BASE_URL}/tasks`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // IMPORTANT
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch tasks (${res.status})`);
                }

                const data: Task[] = await res.json();
                setTasks(data);

            } catch (error) {
                console.error("Error loading tasks:", error);
            }
        };

        loadTasks().then(r => console.log("Tasks loaded:", r));

    }, [router, searchParams]);

    useEffect(() => {
        const controller = new AbortController();

        const loadCategories = async () => {
            try {
                setIsLoadingCategories(true);

                const res = await fetch(`${API_BASE_URL}/categories`, {
                    method: "GET",
                    signal: controller.signal,
                    headers: { "Content-Type": "application/json" },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch categories (${res.status})`);
                }

                const data: Category[] = await res.json();
                setCategories(data);
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    console.error("Error loading categories:", error);
                }
            } finally {
                setIsLoadingCategories(false);
            }
        };

        loadCategories().then(r => console.log("Categories loaded:", r));
        return () => controller.abort();
    }, []);

    return (

        <div className="min-h-screen bg-white p-8">

            <div className="max-w-5xl mx-auto space-y-8">

                {/* Filter Bar */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-end gap-4">

                    <div className="flex-1 space-y-2">

                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Search Keywords</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="e.g. 'Decor', 'Shopping'..."
                                className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500"
                            />
                            <SlidersHorizontal size={18} className="absolute right-4 top-3 text-slate-400" />
                        </div>

                    </div>

                    <div className="w-64 space-y-2">

                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                          Category
                        </label>

                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          disabled={isLoadingCategories}
                          className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 appearance-none"
                        >
                          <option value="">
                            {isLoadingCategories ? "Loading categories..." : "All Categories"}
                          </option>

                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}

                        </select>
                    </div>

                    <div className="w-64 space-y-2">

                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Price Range</label>
                        <select className="w-full bg-slate-50 border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-blue-500 appearance-none">
                            <option>Any Price</option>
                        </select>

                    </div>

                    <button className="bg-[#0069d9] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors h-12">
                        Apply Filters
                    </button>

                </div>


                {/*/!* Active Tags *!/*/}
                {/*<div className="flex items-center gap-2">*/}
                {/*    */}
                {/*    <span className="bg-white px-4 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-700 flex items-center gap-2">*/}
                {/*        Urgent */}
                {/*        <button className="text-slate-400 hover:text-slate-600">×</button>*/}
                {/*    </span>*/}
                {/*    */}
                {/*    <span className="bg-white px-4 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-700 flex items-center gap-2">*/}
                {/*    Within 5 miles */}
                {/*        <button className="text-slate-400 hover:text-slate-600">×</button>*/}
                {/*    </span>*/}
                {/*    */}
                {/*    <button className="text-blue-600 text-sm font-bold ml-2">Clear All</button>*/}
                {/*    */}
                {/*</div>*/}

                {/* Task Cards Container */}
                <div className="space-y-6">

                    {/* Task card*/}
                    <div className="space-y-6">

                        {tasks.map((task) => (

                            <div key={task.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">

                                <div className="p-6">

                                    <div className="flex justify-between items-start mb-4">

                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${task.requesterName}`}
                                                    alt="User"
                                                />
                                            </div>

                                            <div>
                                                <h3 className="font-bold text-slate-900">
                                                    {task.requesterName}
                                                </h3>

                                                <p className="text-xs text-slate-500">
                                                    {new Date(task.createdAt).toLocaleDateString()} •{" "}
                                                    <span className="text-orange-500 font-bold uppercase"></span>
                                                </p>

                                            </div>
                                        </div>

                                        <span className="text-2xl font-black text-[#0069d9]">${task.price}</span>

                                    </div>

                                    <h2 className="text-xl font-extrabold text-slate-900 mb-2">
                                        {task.title}
                                    </h2>

                                    <p className="text-slate-600 text-[15px] mb-6">
                                        {task.description}
                                    </p>

                                    <div className="flex gap-3 mb-6">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-500 text-xs font-semibold">
                                            <MapPin size={14} />
                                            {task.locationText || "No location"}
                                        </div>

                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg text-slate-500 text-xs font-semibold">
                                            <Clock size={14} />
                                            {new Date(task.deadline).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-[#007bff] text-white py-3.5 rounded-xl font-bold hover:bg-blue-600">
                                            Accept Task
                                        </button>
                                        <button className="px-5 border-2 border-slate-100 rounded-xl text-blue-600 hover:bg-slate-50">
                                            <Info size={20} />
                                        </button>
                                    </div>
                                </div>

                                {/*/!* Footer *!/*/}
                                {/*<div className="px-6 py-3 bg-white border-t flex justify-between items-center">*/}

                                {/*    <span className="text-[10px] font-bold text-slate-500 uppercase">+{task.requestCount} People Put Request</span>*/}
                                {/*    <MessageSquare size={18} className="text-blue-500 cursor-pointer" />*/}

                                {/*</div>*/}

                            </div>
                        ))}
                    </div>

                </div>

                {/*/!* Load More *!/*/}
                {/*<div className="flex justify-center pt-8">*/}

                {/*    <button className="px-10 py-4 rounded-full border-2 border-slate-400 text-blue-800 font-bold hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all">*/}
                {/*        Load More Feedback*/}
                {/*    </button>*/}
                {/*</div>*/}

            </div>
        </div>
    );
}