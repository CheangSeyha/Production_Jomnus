"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  MessageSquareText,
  Sparkles,
  Star,
  ThumbsUp,
  Trophy,
} from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";

type Review = {
  id: number;
  reviewerName: string;
    reviewer_id: number; // ← add this

  reviewerImage?: string | null;
  revieweeName?: string;
  rating: number;
  comment: string;
  created_at: string;
  assignment_id: number;
  likesCount?: number;
  likedByMe?: boolean;
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
        const normalized = (data || []).map((review: Review) => ({
          likesCount: review.likesCount ?? 0,
          likedByMe: review.likedByMe ?? false,
          ...review,
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
    const totalRating = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    const average = total ? totalRating / total : 0;
    const helpful = reviews.reduce((sum, review) => sum + (review.likesCount || 0), 0);
    const latest = reviews
      .map((review) => new Date(review.created_at).getTime())
      .filter((time) => !Number.isNaN(time))
      .sort((a, b) => b - a)[0];

    const distribution = [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews.filter((review) => Math.round(review.rating) === rating).length;
      return {
        rating,
        count,
        percentage: total ? Math.round((count / total) * 100) : 0,
      };
    });

    return {
      total,
      average,
      helpful,
      latestDate: latest ? formatDate(new Date(latest).toISOString()) : "No reviews yet",
      distribution,
      fiveStarCount: distribution.find((item) => item.rating === 5)?.count ?? 0,
    };
  }, [reviews]);

  const handleLike = async (id?: number) => {
    if (!id && id !== 0) {
      setNotification("Unable to like this review.");
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setReviews((prev) =>
      prev.map((review) =>
        review.id === id
          ? {
              ...review,
              likedByMe: !review.likedByMe,
              likesCount: (review.likesCount || 0) + (review.likedByMe ? -1 : 1),
            }
          : review
      )
    );

    try {
      await api.post(`/reviews/${id}/like`);
    } catch (err: any) {
      const status = err?.response?.status;

      if (status === 404) {
        try {
          await api.post(`/reviews/${id}/likes`);
        } catch (err2: any) {
          if (err2?.response?.status === 404) return;
          setNotification(err2?.response?.data?.message || "Could not update like.");
          setTimeout(() => setNotification(null), 4000);
        }
        return;
      }

      setReviews((prev) =>
        prev.map((review) =>
          review.id === id
            ? {
                ...review,
                likedByMe: !review.likedByMe,
                likesCount: (review.likesCount || 0) + (review.likedByMe ? -1 : 1),
              }
            : review
        )
      );
      setNotification(err?.response?.data?.message || "Could not update like.");
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const RatingBar = ({ rating, count, percentage }: { rating: number; count: number; percentage: number }) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
        <span>{rating} Star</span>
        <span>{count} reviews</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-sky-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-full px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-1 text-xs font-black uppercase tracking-widest text-sky-600">Reviews</p>
            <h1 className="text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              Community Trust
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
              Real feedback from completed assignments, calculated from your latest reviews.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-2xl border border-sky-200 bg-white/85 px-4 py-3 shadow-sm">
            <Sparkles size={18} className="text-sky-500" />
            <span className="text-sm font-black text-slate-800">
              {stats.total} {stats.total === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_1fr]">
          <aside className="h-fit rounded-3xl border border-sky-200 bg-white/90 p-6 shadow-[0_18px_45px_rgba(14,165,233,0.14)]">
            <div className="rounded-3xl bg-gradient-to-br from-sky-600 to-cyan-500 p-6 text-white shadow-lg shadow-sky-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-sky-100">Overall rating</p>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-6xl font-black leading-none">
                      {stats.average ? stats.average.toFixed(1) : "0.0"}
                    </span>
                    <span className="pb-1 text-xl font-black text-sky-100">/5</span>
                  </div>
                </div>
                <span className="rounded-2xl bg-white/20 p-3">
                  <Trophy size={24} />
                </span>
              </div>
              <div className="mt-4">
                <Stars rating={stats.average} size={20} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-2xl font-black text-emerald-700">{stats.fiveStarCount}</p>
                <p className="text-xs font-bold text-emerald-700">Five-star reviews</p>
              </div>
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                <p className="text-2xl font-black text-indigo-700">{stats.helpful}</p>
                <p className="text-xs font-bold text-indigo-700">Helpful votes</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {stats.distribution.map((item) => (
                <RatingBar key={item.rating} {...item} />
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <CalendarDays size={17} className="text-sky-500" />
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Latest review</p>
                <p className="text-sm font-bold text-slate-800">{stats.latestDate}</p>
              </div>
            </div>
          </aside>

          <section className="space-y-4">
            {notification && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">
                {notification}
              </div>
            )}

            {loading && (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-44 animate-pulse rounded-3xl border border-sky-100 bg-white/80" />
                ))}
              </div>
            )}

            {!loading && reviews.length === 0 && (
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-sky-200 bg-white/85 p-8 text-center">
                <MessageSquareText size={42} className="text-sky-400" />
                <h2 className="mt-4 text-xl font-black text-slate-900">No reviews yet</h2>
                <p className="mt-2 max-w-md text-sm font-medium text-slate-500">
                  Once clients review your completed assignments, your rating and review history will appear here.
                </p>
              </div>
            )}

            {!loading &&
              reviews.map((review) => (
                <article
                  key={review.id}
                  className="group overflow-hidden rounded-3xl border border-sky-100 bg-white p-6 shadow-[0_8px_28px_rgba(14,165,233,0.08)] transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-[0_18px_42px_rgba(14,165,233,0.16)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <Link href={`/profile/${review.reviewer_id}`} className="flex min-w-0 gap-4 group/avatar">

                      <img
                        src={
                          review.reviewerImage ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewerName}`
                        }
                        alt={review.reviewerName}
                        className="h-14 w-14 shrink-0 rounded-2xl border border-sky-100 bg-sky-50 object-cover"
                      />

                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-black text-slate-950">{review.reviewerName}</h3>
                        <p className="text-sm font-semibold text-slate-500">
                          Task #{review.assignment_id} • {formatDate(review.created_at)}
                        </p>
                      </div>
                      </Link>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2">
                      <Stars rating={review.rating} size={16} />
                      <span className="text-xs font-black text-amber-700">
                        {ratingLabels[Math.round(review.rating)] || `${review.rating}/5`}
                      </span>
                    </div>
                  </div>

                  <p className="mt-5 text-base font-medium leading-7 text-slate-600">
                    {review.comment || "No written comment was added."}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    <button
                      onClick={() => handleLike(review.id)}
                      className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition ${
                        review.likedByMe
                          ? "bg-sky-50 text-sky-700"
                          : "text-slate-400 hover:bg-sky-50 hover:text-sky-700"
                      }`}
                    >
                      <ThumbsUp size={18} />
                      <span>{review.likesCount || 0} Helpful</span>
                    </button>
                  </div>
                </article>
              ))}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
