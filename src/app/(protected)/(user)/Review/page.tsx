"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, MessageSquareText, Sparkles, Star } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";

type Review = {
  id: number;
  reviewerName: string;
  reviewer_id: number;
  reviewerImage?: string | null;
  revieweeName?: string;
  rating: number;
  reliability?: number;
  speed?: number;
  communication?: number;
  accuracy?: number;
  comment: string;
  created_at: string;
  assignment_id: number;
  task_title: string;
};

const ratingLabels: Record<number, string> = {
  5: "Excellent",
  4: "Great",
  3: "Good",
  2: "Fair",
  1: "Needs work",
};

function formatDate(date?: string) {
  if (!date) return "No date";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Invalid date";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Stars({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < Math.round(rating) ? "currentColor" : "none"}
          className={i < Math.round(rating) ? "" : "text-slate-200"}
        />
      ))}
    </div>
  );
}

function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("access_token")) {
      setLoading(false);
      return;
    }

    const loadReviews = async () => {
      try {
        const { data } = await api.get<Review[]>("/reviews/me");
        const normalized = (data || []).map((review: any) => ({
          ...review,
          likesCount: review.likesCount ?? 0,
          likedByMe: review.likedByMe ?? false,
          task_title: review.task_title ?? "Unknown task",
        }));
        setReviews(normalized);
      } catch (err) {
        console.error("Error loading reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, []);

  const stats = useMemo(() => {
    const total = reviews.length;
    const totalRating = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
    const average = total ? totalRating / total : 0;
    const latest = reviews
      .map((r) => new Date(r.created_at).getTime())
      .filter((t) => !Number.isNaN(t))
      .sort((a, b) => b - a)[0];

    const distribution = [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews.filter((r) => Math.round(r.rating) === rating).length;
      return { rating, count, percentage: total ? Math.round((count / total) * 100) : 0 };
    });

    return {
      total,
      average,
      latestDate: latest ? formatDate(new Date(latest).toISOString()) : "No reviews yet",
      distribution,
      fiveStarCount: distribution.find((d) => d.rating === 5)?.count ?? 0,
    };
  }, [reviews]);

  return (
    <div className="min-h-full px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              Community Trust
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
              Real feedback from completed assignments, calculated from your latest reviews.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-sky-200 bg-white px-4 py-3 shadow-sm">
            <Sparkles size={18} className="text-sky-500" />
            <span className="text-sm font-black text-slate-800">
              {stats.total} {stats.total === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[400px_1fr]">

          {/* Sidebar */}
          <aside className="h-fit rounded-2xl border border-sky-200 bg-white overflow-hidden">

            {/* Rating hero */}
            <div className="bg-sky-50 border-b border-sky-100 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-3">
                Overall rating
              </p>
              <div className="flex items-end gap-2 mb-3">
                <span className="text-5xl font-black text-slate-950 leading-none">
                  {stats.average ? stats.average.toFixed(1) : "0.0"}
                </span>
                <span className="text-lg font-bold text-slate-400 pb-1">/5</span>
              </div>
              <Stars rating={stats.average} size={20} />
            </div>

            <div className="p-5 space-y-5">

              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                  <p className="text-2xl font-black text-emerald-700">{stats.fiveStarCount}</p>
                  <p className="text-xs font-bold text-emerald-600 mt-1">Five-star</p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                  <p className="text-2xl font-black text-slate-700">{stats.total}</p>
                  <p className="text-xs font-bold text-slate-500 mt-1">Total</p>
                </div>
              </div>

              {/* Rating bars */}
              <div className="space-y-3">
                {stats.distribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 w-10 shrink-0">
                      {rating} ★
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-yellow-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all bg-gradient-to-r from-yellow-200 to-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-400 w-4 text-right shrink-0">
                      {count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Latest date */}
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <CalendarDays size={16} className="text-sky-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Latest review
                  </p>
                  <p className="text-sm font-bold text-slate-800">{stats.latestDate}</p>
                </div>
              </div>

            </div>
          </aside>

          {/* Reviews */}
          <section className="space-y-4">

            {notification && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                {notification}
              </div>
            )}

            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-44 animate-pulse rounded-2xl border border-sky-100 bg-white" />
                ))}
              </div>
            )}

            {!loading && reviews.length === 0 && (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-sky-200 bg-white p-8 text-center">
                <MessageSquareText size={40} className="text-sky-300" />
                <h2 className="mt-4 text-xl font-black text-slate-900">No reviews yet</h2>
                <p className="mt-2 max-w-md text-sm font-medium text-slate-500">
                  Once clients review your completed assignments, your rating and review history will appear here.
                </p>
              </div>
            )}

            {!loading && reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-sky-100 bg-white p-6 transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_8px_24px_rgba(14,165,233,0.1)]"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                  {/* Reviewer */}
                  <Link href={`/profile/${review.reviewer_id}`} className="flex min-w-0 gap-4">
                    <img
                      src={
                        review.reviewerImage ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewerName}`
                      }
                      alt={review.reviewerName}
                      className="h-12 w-12 shrink-0 rounded-xl border border-sky-100 bg-sky-50 object-cover"
                    />
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-black text-slate-950">
                        {review.reviewerName}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">
                        {review.task_title || "Unknown task"} · {formatDate(review.created_at)}
                      </p>
                    </div>
                  </Link>

                  {/* Rating badge */}
                  <div className="flex shrink-0 items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                    <Stars rating={review.rating} size={14} />
                    <span className="text-xs font-black text-amber-700">
                      {ratingLabels[Math.round(review.rating)] || `${review.rating}/5`}
                    </span>
                  </div>

                </div>

                {/* Comment */}
                <p className="mt-4 text-sm font-medium leading-7 text-slate-600">
                  {review.comment || "No written comment was added."}
                </p>

                {/* Sub-ratings */}
                {(review.reliability || review.speed || review.communication || review.accuracy) && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                    {[
                      { label: "Reliability", value: review.reliability },
                      { label: "Speed", value: review.speed },
                      { label: "Communication", value: review.communication },
                      { label: "Accuracy", value: review.accuracy },
                    ]
                      .filter((r) => r.value)
                      .map((r) => (
                        <span
                          key={r.label}
                          className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700"
                        >
                          {r.label}
                          <span className="rounded-full bg-sky-200 px-1.5 py-0.5 text-[10px] text-sky-800">
                            {r.value}/5
                          </span>
                        </span>
                      ))}
                  </div>
                )}

              </article>
            ))}

          </section>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;