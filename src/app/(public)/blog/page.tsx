"use client";

import React from 'react';
import { ChevronRight, Clock, ExternalLink } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import Link from "next/link";
import { posts } from "@/lib/post";


export default function BlogBody() {
    const shouldReduceMotion = useReducedMotion();

    const fadeUp = (delay = 0): any => ({
        initial: shouldReduceMotion ? {} : { opacity: 0, y: 20 },
        whileInView: shouldReduceMotion ? {} : { opacity: 1, y: 0 },
        transition: shouldReduceMotion ? { duration: 0 } : { duration: 0.55, delay, ease: 'easeOut' },
        viewport: { once: false, amount: 0.2 },
    });

    const staggerContainer = {
        hidden: {},
        show: {
            transition: shouldReduceMotion
                ? { staggerChildren: 0 }
                : { staggerChildren: 0.12, delayChildren: 0.08 },
        },
    };

    const staggerItem = {
        hidden: shouldReduceMotion ? {} : { opacity: 0, y: 16 },
        show: shouldReduceMotion ? {} : { opacity: 1, y: 0 },
    };

    const float = (offset = 8, duration = 6, delay = 0): any =>
        shouldReduceMotion
            ? undefined
            : {
                  y: [0, -offset, 0],
                  transition: {
                      duration,
                      repeat: Infinity,
                      ease: 'easeInOut' as const,
                      delay,
                  },
              };

    return (


        <div className="w-full bg-white overflow-hidden">


            {/* 1. FEATURED ARTICLE */}
            <motion.section
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 grid md:grid-cols-2 gap-8 md:gap-12 items-center"
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView={shouldReduceMotion ? undefined : 'show'}
                variants={staggerContainer}
                viewport={{ once: false, amount: 0.2 }}
            >

                <motion.div className="rounded-4xl overflow-hidden shadow-xl aspect-video bg-slate-100 relative" variants={staggerItem} animate={float(8, 8, 0.15)}>
                    <motion.img
                        src="/images/teams/luy.png"
                        alt="Laptop on desk"
                        className="w-full h-full object-cover"
                        animate={shouldReduceMotion ? undefined : { scale: [1, 1.03, 1] }}
                        transition={shouldReduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </motion.div>


                <motion.div className="space-y-5 sm:space-y-6" variants={staggerItem}>
                    <motion.span
                        className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest inline-flex"
                        animate={shouldReduceMotion ? undefined : { y: [0, -2, 0] }}
                        transition={shouldReduceMotion ? undefined : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        Featured Article
                    </motion.span>
                    <motion.h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight" variants={staggerItem}>
                        How to Earn Your <br />First $500 on <br />TaskExchange
                    </motion.h1>
                    <motion.div className="flex items-center gap-3" variants={staggerItem}>
                        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                            SK
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Sophea Kanha</p>
                            <p className="text-xs text-slate-400 font-medium">First User</p>
                        </div>
                    </motion.div>
                    <Link href="/blog/how-to-earn-first-500">
                        <motion.button
                            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2 hover:bg-blue-700 transition w-full sm:w-auto"
                            variants={staggerItem}
                            animate={shouldReduceMotion ? undefined : { scale: [1, 1.02, 1] }}
                            transition={shouldReduceMotion ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                            whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                        >
                            Read Full Story <ChevronRight size={18} />
                        </motion.button>
                    </Link>
                </motion.div>
            </motion.section>



            {/* 2. CATEGORY FILTERS */}
            <motion.section
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-wrap gap-3"
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView={shouldReduceMotion ? undefined : 'show'}
                variants={staggerContainer}
                viewport={{ once: false, amount: 0.2 }}
            >
                {/*{categories.map((cat, i) => (*/}
                {/*    <motion.button*/}
                {/*        key={i}*/}
                {/*        className={`px-5 py-2 rounded-full text-xs font-bold transition ${*/}
                {/*            i === 0 ? 'bg-blue-600 text-white shadow-md shadow-blue-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'*/}
                {/*        }`}*/}
                {/*        variants={staggerItem}*/}
                {/*        whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.03 }}*/}
                {/*        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}*/}
                {/*    >*/}
                {/*        {cat}*/}
                {/*    </motion.button>*/}
                {/*))}*/}
            </motion.section>


            {/* 3. MAIN CONTENT GRID */}
            <motion.section
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 grid lg:grid-cols-3 gap-8 lg:gap-12"
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView={shouldReduceMotion ? undefined : 'show'}
                variants={staggerContainer}
                viewport={{ once: false, amount: 0.2 }}
            >
                {/* Latest Journal Entries (Left/Center Columns) */}
                <motion.div className="lg:col-span-2" variants={staggerItem}>
                    <motion.div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10" {...fadeUp(0.04)}>
                        <div className="h-0.5 w-8 bg-blue-600"></div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">The Latest Journal Entries</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-10 sm:gap-y-12">
                        {posts.map((post, i) => (
                            <Link href={`/blog/${post.slug}`}
                                  key={i}>
                                <motion.div
                                    key={i}
                                    className="group cursor-pointer"
                                    variants={staggerItem}
                                    animate={float(3, 6 + (i % 2), i * 0.18)}
                                    whileHover={shouldReduceMotion ? undefined : { y: -4 }}
                                >
                                    <div className="relative aspect-16/10 rounded-2xl overflow-hidden mb-5 bg-slate-100">
                                        <span className="absolute top-4 left-4 z-10 bg-blue-500/90 text-white text-[10px] font-bold px-2 py-1 rounded tracking-widest uppercase">
                                            {post.tag}
                                        </span>
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                    </div>
                                    {/*<div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold mb-3">*/}
                                    {/*    <Clock size={12} /> {post.readTime}*/}
                                    {/*</div>*/}
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
                                        {post.desc}
                                    </p>
                                    <div className="text-blue-600 text-xs font-black flex items-center gap-1">
                                        Read More <ChevronRight size={14} />
                                    </div>
                                </motion.div>

                            </ Link>
                        ))}
                    </div>

                    {/*<motion.div className="mt-12 sm:mt-16 flex justify-center" {...fadeUp(0.1)}>*/}
                    {/*    <motion.button*/}
                    {/*        className="bg-slate-100 text-slate-900 px-10 py-3 rounded-xl font-bold hover:bg-slate-200 transition"*/}
                    {/*        animate={shouldReduceMotion ? undefined : { scale: [1, 1.02, 1] }}*/}
                    {/*        transition={shouldReduceMotion ? undefined : { duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}*/}
                    {/*        whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}*/}
                    {/*        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}*/}
                    {/*    >*/}
                    {/*        Load More Articles*/}
                    {/*    </motion.button>*/}
                    {/*</motion.div>*/}
                </motion.div>


                {/* Sidebar (Right Column) */}
                <motion.div className="space-y-8 sm:space-y-12" variants={staggerItem}>



                    {/* Popular Now */}
                    <motion.div {...fadeUp(0.08)}>
                        <div className="flex items-center gap-2 mb-6 text-blue-600">
                            <ExternalLink size={20} />
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Popular Now</h3>
                        </div>
                        <ul className="space-y-5 sm:space-y-6">
                            {[
                                { rank: "01", title: "10 Most In-Demand Skills for 2026", cat: "Marketplace News" },
                                { rank: "02", title: "The Psychology of Pricing Your Service", cat: "Tasker Guides" },
                                { rank: "03", title: "Best Practices for On-Site Safety", cat: "Safety Tips" }
                            ].map((item, i) => (
                                <motion.li
                                    key={i}
                                    className="flex gap-4 items-start group cursor-pointer"
                                    animate={float(2, 5.5 + i, i * 0.12)}
                                    whileHover={shouldReduceMotion ? undefined : { x: 4 }}
                                >
                                    <span className="text-2xl sm:text-3xl font-black text-blue-200 group-hover:text-blue-600 transition">{item.rank}</span>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 leading-snug mb-1">{item.title}</h4>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{item.cat}</p>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>



                    {/* Sidebar CTA Card */}
                    <motion.div
                        className="bg-blue-600 rounded-3xl sm:rounded-4xl p-6 sm:p-8 text-white relative overflow-hidden"
                        {...fadeUp(0.12)}
                    >
                        <motion.div
                            className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-orange-500/30"
                            animate={shouldReduceMotion ? undefined : { scale: [1, 1.12, 1] }}
                            transition={shouldReduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <h3 className="text-xl sm:text-2xl font-black mb-4 relative z-10">Join The Journal Weekly</h3>
                        <p className="text-blue-100 text-xs mb-8 leading-relaxed opacity-90 relative z-10">
                            Get the latest success stories, task alerts, and safety tips delivered straight to your inbox.
                        </p>
                        <div className="space-y-3 relative z-10">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-blue-500/50 border border-blue-400 rounded-xl px-4 py-3 text-sm placeholder:text-blue-200 outline-none"
                            />
                            <motion.button
                                className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition"
                                animate={shouldReduceMotion ? undefined : { scale: [1, 1.02, 1] }}
                                transition={shouldReduceMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                                whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
                                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                            >
                                Subscribe Now
                            </motion.button>


                            <motion.div
                                className="absolute -bottom-20 -left-8 w-28 h-28 rounded-full bg-orange-500/30"
                                animate={shouldReduceMotion ? undefined : { scale: [1, 1.12, 1] }}
                                transition={shouldReduceMotion ? undefined : { duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            />

                        </div>
                        <p className="text-[9px] text-center mt-4 text-blue-200 font-medium relative z-10">No spam. Only high-value insights.</p>
                    </motion.div>

                </motion.div>
            </motion.section>
        </div>
    );
}

// const categories = ["All", "Success Stories", "Safety Tips", "Tasker Guides", "Marketplace News"];
//
// const posts = [
//     {
//         tag: "SUCCESS STORY",
//         title: "From Errands to Full-Time: Sok Dara's Journey",
//         desc: "Discover how Sok Dara turned a weekend side hustle of running small errands into a thriving full-time career on the TaskExchange platform.",
//         readTime: "6 MIN READ",
//         image: "/images/teams/blog1.png"
//     },
//     {
//         tag: "SAFETY TIPS",
//         title: "Securing Your Digital Identity on the Marketplace",
//         desc: "Our guide to keeping your account safe, identifying phishing attempts, and ensuring every transaction is secure.",
//         readTime: "4 MIN READ",
//         image: "/images/teams/blog2.png"
//     },
//     {
//         tag: "TASKER GUIDES",
//         title: "Mastering Your Profile for High-Value Clients",
//         desc: "How to structure your portfolio and biography to attract enterprise-level tasks and long-term community contracts.",
//         readTime: "8 MIN READ",
//         image: "/images/teams/blog3.png"
//     },
//     {
//         tag: "MARKETPLACE NEWS",
//         title: "Introducing TaskExchange Groups: Local Networking",
//         desc: "We're launching local hubs to help taskers connect, share equipment, and collaborate on large-scale community projects.",
//         readTime: "3 MIN READ",
//         image: "/images/teams/blog4.png"
//     }
// ];