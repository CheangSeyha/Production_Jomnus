"use client";

import {useEffect, useState} from "react";
import { Star, ThumbsUp, Reply, ChevronDown } from 'lucide-react';

type Review = {
    id: number;
    reviewerName: string;
    reviewerImage?: string;
    revieweeName?: string;
    rating: number;
    comment: string;
    created_at: string;
    assignment_id: number;
};

function ReviewPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const loadReviews = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/reviews/me", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(`Failed to fetch reviews (${res.status})`);
                }

                const data = await res.json();
                setReviews(data);

            } catch (err) {
                console.error("Error loading reviews:", err);
            } finally {
                setLoading(false);
            }
        };

        loadReviews();

    }, []);

    const RatingBar = ({ label, percentage }: { label: string; percentage: number }) => (
        <div className="flex items-center gap-4 text-sm">
            <span className="w-12 text-slate-500 font-medium">{label}</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#005bc4] rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <span className="w-8 text-right text-slate-400 font-bold">{percentage}%</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-white p-8">

            {/* Header Section */}
            <div className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-5xl font-bold text-black tracking-tight mb-2">Community Trust</h1>
                    <p className="text-slate-500 text-lg max-w-md">
                        Browse authentic feedback from your recent clients and see how you're performing across the marketplace.
                    </p>
                </div>

            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">

                {/* LEFT: Stats Sidebar */}
                <div className="bg-white rounded-4xl p-8 h-fit shadow-xl">
                    <div className="mb-6">
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-6xl font-black text-[#005bc4]">4.9</span>
                            <span className="text-2xl font-bold text-slate-300">/5</span>
                        </div>
                        <div className="flex gap-1 text-orange-500 mb-2">
                            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                        </div>
                        <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Based on 142 total reviews</p>
                    </div>

                    <div className="space-y-4">
                        <RatingBar label="5 Star" percentage={88} />
                        <RatingBar label="4 Star" percentage={10} />
                        <RatingBar label="3 Star" percentage={2} />
                        <RatingBar label="2 Star" percentage={0} />
                        <RatingBar label="1 Star" percentage={0} />
                    </div>
                </div>


                {/* RIGHT: Feed */}
                <div className="space-y-6">

                    {/* Sort Bar */}
                    {/*<div className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">*/}
                    {/*    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">Sort By</span>*/}
                    {/*    <button className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-sm font-bold text-slate-700">*/}
                    {/*        Most Recent <ChevronDown size={16} />*/}
                    {/*    </button>*/}
                    {/*</div>*/}


                    {/* Review Cards */}

                    {loading && <p>Loading reviews...</p>}

                    {!loading && reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-50 hover:scale-[1.01] transition-transform">

                            <div className="flex justify-between items-start mb-6">
                                <div className="flex gap-4">
                                    <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden">
                                        <img
                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewerName}`}
                                            alt={review.reviewerName}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 text-lg">
                                            {review.reviewerName}
                                        </h3>

                                        <p className="text-sm text-slate-400">
                                            {new Date(review.created_at).toLocaleDateString()} • Task #{review.assignment_id}
                                        </p>
                                    </div>
                                </div>

                                {/* ⭐ Rating */}
                                <div className="flex gap-0.5 text-orange-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            fill={i < review.rating ? "currentColor" : "none"}
                                            className={i < review.rating ? "" : "text-slate-200"}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="text-slate-600 text-lg mb-6">
                                {review.comment}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center gap-6 pt-6 border-t">
                                <button className="flex items-center gap-2 text-slate-400 hover:text-[#005bc4] text-sm font-bold">
                                    <ThumbsUp size={18} /> Helpful
                                </button>

                                <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm font-bold">
                                    <Reply size={18} /> Reply
                                </button>
                            </div>

                        </div>
                    ))}

                    {/*/!* Load More *!/*/}
                    {/*<div className="flex justify-center pt-8">*/}

                    {/*    <button className="px-10 py-4 rounded-full border-2 border-slate-400 text-blue-800 font-bold hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all">*/}
                    {/*        Load More Feedback*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                </div>

            </div>

        </div>
    );
}

export default ReviewPage;
