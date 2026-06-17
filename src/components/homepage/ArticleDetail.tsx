"use client";

import React, { useState } from "react";
import {
    ChevronRight,
    ArrowLeft,
    Share2,
    Bookmark,
    Heart,
    MessageCircle,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { posts, Post } from "@/lib/post";

const relatedPosts = [
    {
        tag: "TASKER GUIDES",
        title: "Mastering Your Profile for High-Value Clients",
        // readTime: "8 MIN READ",
        image: "/images/teams/blog3.png",
    },
    {
        tag: "MARKETPLACE NEWS",
        title: "Introducing TaskExchange Groups: Local Networking",
        // readTime: "3 MIN READ",
        image: "/images/teams/blog4.png",
    },
    {
        tag: "SAFETY TIPS",
        title: "Securing Your Digital Identity on the Marketplace",
        // readTime: "4 MIN READ",
        image: "/images/teams/blog2.png",
    },
];

const articleContent = [
    {
        type: "paragraph",
        text: "Three years ago, Sok Dara was working a desk job he described as \"comfortable but slowly suffocating.\" On weekends he started accepting small errands on TaskExchange — grocery runs, furniture assembly, airport pickups. Within six months his weekend income quietly overtook his Monday-to-Friday salary.",
    },
    {
        type: "pullquote",
        text: "I didn't quit my job. My job quit me — because the numbers stopped making sense.",
        attribution: "Sok Dara, Full-Time Tasker",
    },
    {
        type: "heading",
        text: "The First 90 Days",
    },
    {
        type: "paragraph",
        text: "Sok's early strategy was deceptively simple: accept every task within a 5-kilometre radius, even if the payout felt small. He was building a review trail. By day 90 he had 47 five-star reviews, a profile completion score of 98%, and an acceptance rate that kept him near the top of local search results.",
    },
    {
        type: "stat-row",
        stats: [
            { value: "47", label: "5-Star Reviews" },
            { value: "98%", label: "Profile Score" },
            { value: "$1,240", label: "Month 3 Earnings" },
        ],
    },
    {
        type: "heading",
        text: "Niching Down to Scale Up",
    },
    {
        type: "paragraph",
        text: "Around month four, Sok noticed that furniture assembly and flat-pack builds earned 40% more per hour than general errands, and clients were more likely to rebook. He quietly dropped errand categories and doubled down on assembly. He bought a quality toolkit, photographed finished jobs, and started attaching before-and-after images to every completed task.",
    },
    {
        type: "paragraph",
        text: "The profile pivot took two weeks to register in search rankings. By month six, 70% of his bookings were assembly work — and his average ticket had climbed from $18 to $54.",
    },
    {
        type: "pullquote",
        text: "Specialising felt like shrinking. It turned out to be the opposite.",
        attribution: "Sok Dara",
    },
    {
        type: "heading",
        text: "Going Full-Time",
    },
    {
        type: "paragraph",
        text: "Sok gave notice on a Friday. The following Monday he accepted his first $200 same-day booking — a six-piece wardrobe for a family that had just moved in. He still remembers the task ID. Today he earns more than three times his old salary, works four days a week, and has a waitlist of returning clients.",
    },
];

export default function ArticleDetail({ post }: { post: Post }) {
    const shouldReduceMotion = useReducedMotion();
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [copied, setCopied] = useState(false);
    const [likeCount, setLikeCount] = useState(284);

    const fadeUp = (delay = 0) => ({
        initial: shouldReduceMotion ? {} : { opacity: 0, y: 22 },
        whileInView: shouldReduceMotion ? {} : { opacity: 1, y: 0 },
        transition: shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.55, delay, ease: "easeOut" as const },
        viewport: { once: false, amount: 0.15 },
    });

    const staggerContainer = {
        hidden: {},
        show: {
            transition: shouldReduceMotion
                ? { staggerChildren: 0 }
                : { staggerChildren: 0.1, delayChildren: 0.05 },
        },
    };

    const staggerItem = {
        hidden: shouldReduceMotion ? {} : { opacity: 0, y: 14 },
        show: shouldReduceMotion ? {} : { opacity: 1, y: 0 },
    };

    const handleLike = () => {
        setLiked((v) => !v);
        setLikeCount((c) => (liked ? c - 1 : c + 1));
    };

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const relatedPosts = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

    return (
        <div className="w-full bg-white overflow-hidden">

            <motion.div
                className="relative w-full h-[56vw] max-h-160 min-h-80 overflow-hidden"
                initial={shouldReduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7 }}
            >
                <motion.img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    animate={shouldReduceMotion ? undefined : { scale: [1, 1.04, 1] }}
                    transition={shouldReduceMotion ? undefined : { duration: 14, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                {/* Back button */}
                <motion.button
                    className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-white/25 transition"
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.2 }}
                    whileHover={shouldReduceMotion ? undefined : { x: -2 }}
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft size={14} /> Back to Journal
                </motion.button>

                <motion.div
                    className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-2"
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.25 }}
                >
                    <button
                        onClick={() => setSaved((v) => !v)}
                        className={`p-2.5 rounded-full backdrop-blur-md border transition ${
                            saved
                                ? "bg-blue-600 border-blue-500 text-white"
                                : "bg-white/15 border-white/20 text-white hover:bg-white/25"
                        }`}
                    >
                        <Bookmark size={15} fill={saved ? "currentColor" : "none"} />
                    </button>
                    <button className="p-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 transition">
                        <Share2 size={15} />
                    </button>
                </motion.div>

                <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 sm:pb-10 max-w-4xl mx-auto">
                    <motion.span
                        className="inline-flex bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded tracking-widest uppercase mb-4"
                        {...fadeUp(0.15)}
                    >
                        {post.tag}
                    </motion.span>
                    <motion.h1
                        className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4"
                        {...fadeUp(0.22)}
                    >
                        {post.title}
                    </motion.h1>
                    <motion.div
                        className="flex flex-wrap items-center gap-4 text-white/70 text-xs font-medium"
                        {...fadeUp(0.3)}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-black text-white">
                                SK
                            </div>
                            <span className="text-white font-bold">Sophea Kanha</span>
                            <span className="text-white/40">·</span>
                            <span>Community Editor</span>
                        </div>

                        <span>June 8, 2026</span>
                    </motion.div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">

                <main>
                    <motion.p
                        className="text-lg sm:text-xl text-slate-500 leading-relaxed font-medium mb-10 border-l-4 border-blue-600 pl-5"
                        {...fadeUp(0.05)}
                    >
                        {post.desc}
                    </motion.p>

                    <div className="space-y-7">
                        {post.content.map((block, i) => {
                            if (block.type === "paragraph")
                                return (
                                    <motion.p
                                        key={i}
                                        className="text-slate-600 text-base sm:text-lg leading-relaxed"
                                        {...fadeUp(0.04 + i * 0.02)}
                                    >
                                        {block.text}
                                    </motion.p>
                                );

                            if (block.type === "heading")
                                return (
                                    <motion.h2
                                        key={i}
                                        className="text-2xl sm:text-3xl font-black text-slate-900 mt-12 mb-2"
                                        {...fadeUp(0.04 + i * 0.02)}
                                    >
                                        {block.text}
                                    </motion.h2>
                                );

                            if (block.type === "pullquote")
                                return (
                                    <motion.blockquote
                                        key={i}
                                        className="relative my-10 pl-6 pr-4 py-6 bg-blue-50 rounded-2xl border-l-4 border-blue-600"
                                        {...fadeUp(0.04 + i * 0.02)}
                                    >
                                        <p className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-3">
                                            &ldquo;{block.text}&rdquo;
                                        </p>
                                        <cite className="text-xs font-bold text-blue-600 uppercase tracking-widest not-italic">
                                            — {block.attribution}
                                        </cite>
                                    </motion.blockquote>
                                );

                            if (block.type === "stat-row")
                                return (
                                    <motion.div
                                        key={i}
                                        className="grid grid-cols-3 gap-4 my-10 p-6 bg-slate-50 rounded-2xl"
                                        {...fadeUp(0.04 + i * 0.02)}
                                    >
                                        {block.stats!.map((s, si) => (
                                            <div key={si} className="text-center">
                                                <p className="text-3xl sm:text-4xl font-black text-blue-600">
                                                    {s.value}
                                                </p>
                                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                    {s.label}
                                                </p>
                                            </div>
                                        ))}
                                    </motion.div>
                                );

                            return null;
                        })}
                    </div>

                    {/* Tags */}
                    <motion.div
                        className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-slate-100"
                        {...fadeUp(0.08)}
                    >
                        {["Success Story", "Tasker Guides", "Earnings", "Career"].map((t, i) => (
                            <span
                                key={i}
                                className="bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-500 text-xs font-bold px-4 py-2 rounded-full cursor-pointer transition"
                            >
                                {t}
                            </span>
                        ))}
                    </motion.div>

                    {/* Reactions row */}
                    <motion.div
                        className="flex items-center justify-between mt-8 py-6 border-t border-slate-100"
                        {...fadeUp(0.1)}
                    >
                        <div className="flex items-center gap-4">
                            <motion.button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition ${
                                    liked
                                        ? "bg-red-50 text-red-500"
                                        : "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500"
                                }`}
                                whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                            >
                                <Heart size={16} fill={liked ? "currentColor" : "none"} />
                                {likeCount}
                            </motion.button>
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition">
                                <MessageCircle size={16} />
                                41
                            </button>
                        </div>

                    </motion.div>

                    {/* Author card */}
                    <motion.div
                        className="mt-6 p-6 sm:p-8 bg-slate-50 rounded-3xl flex gap-5 items-start"
                        {...fadeUp(0.12)}
                    >
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                            SK
                        </div>
                        <div>
                            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Written by</p>
                            <h4 className="text-lg font-black text-slate-900">Sophea Kanha</h4>
                            <p className="text-sm text-slate-400 font-medium mb-3">Community Editor · TaskExchange Journal</p>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Sophea covers success stories and community features. She&apos;s spoken with hundreds of taskers across Cambodia to bring their journeys to the Journal.
                            </p>
                        </div>
                    </motion.div>
                </main>

                <aside className="space-y-10">
                    <motion.div className="sticky top-6 space-y-8" {...fadeUp(0.1)}>


                        {/* Newsletter CTA */}
                        <div className="bg-blue-600 rounded-3xl p-6 text-white relative overflow-hidden">
                            <motion.div
                                className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-orange-500/30"
                                animate={shouldReduceMotion ? undefined : { scale: [1, 1.15, 1] }}
                                transition={shouldReduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.div
                                className="absolute -bottom-8 -left-6 w-20 h-20 rounded-full bg-orange-500/20"
                                animate={shouldReduceMotion ? undefined : { scale: [1, 1.12, 1] }}
                                transition={shouldReduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            />
                            <h3 className="text-lg font-black mb-2 relative z-10">Get stories like this</h3>
                            <p className="text-blue-100 text-xs leading-relaxed mb-5 relative z-10">
                                Weekly success stories & tasker tips — straight to your inbox.
                            </p>
                            <div className="space-y-2 relative z-10">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="w-full bg-blue-500/50 border border-blue-400 rounded-xl px-4 py-2.5 text-sm placeholder:text-blue-200 outline-none text-white"
                                />
                                <motion.button
                                    className="w-full bg-white text-blue-600 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition"
                                    whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                                    whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                                >
                                    Subscribe
                                </motion.button>
                            </div>
                        </div>

                        {/* Popular Now */}
                        <div>
                            <div className="flex items-center gap-2 mb-5">
                                <span className="font-black text-slate-900 uppercase tracking-widest text-xs">Popular Now</span>
                            </div>

                            <ul className="space-y-5">
                                {[
                                    { rank: "01", title: "10 Most In-Demand Skills for 2026", cat: "Marketplace News" },
                                    { rank: "02", title: "The Psychology of Pricing Your Service", cat: "Tasker Guides" },
                                    { rank: "03", title: "Best Practices for On-Site Safety", cat: "Safety Tips" },
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 items-start group cursor-pointer">
                                        <span className="text-2xl font-black text-blue-200 group-hover:text-blue-600 transition leading-none">{item.rank}</span>
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 leading-snug mb-0.5 group-hover:text-blue-600 transition">{item.title}</h4>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{item.cat}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </aside>
            </div>

            <motion.section
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-t border-slate-100"
                initial={shouldReduceMotion ? false : "hidden"}
                whileInView={shouldReduceMotion ? undefined : "show"}
                variants={staggerContainer}
                viewport={{ once: false, amount: 0.15 }}
            >
                <motion.div className="flex items-center gap-4 mb-10" variants={staggerItem}>
                    <div className="h-0.5 w-8 bg-blue-600" />
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">More From The Journal</h2>
                </motion.div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {relatedPosts.map((related, i) => (
                        <Link href={`/blog/${related.slug}`} key={i}>
                            <motion.div
                                className="group cursor-pointer"
                                variants={staggerItem}
                                whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                            >
                                <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-100">
                    <span className="absolute top-3 left-3 z-10 bg-blue-500/90 text-white text-[9px] font-bold px-2 py-1 rounded tracking-widest uppercase">
                        {related.tag}
                    </span>
                                    <img
                                        src={related.image}
                                        alt={related.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition mb-3">
                                    {related.title}
                                </h3>
                                <div className="text-blue-600 text-xs font-black flex items-center gap-1">
                                    Read More <ChevronRight size={13} />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

            </motion.section>
        </div>
    );
}