"use client";
import React from 'react';
import Image from 'next/image';
import { Mail, HelpCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

export default function ContactUsBody() {
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

    const drift = (x = 10, y = 10, duration = 12, delay = 0): any =>
        shouldReduceMotion
            ? undefined
            : {
                  x: [0, x, 0],
                  y: [0, -y, 0],
                  transition: {
                      duration,
                      repeat: Infinity,
                      ease: 'easeInOut' as const,
                      delay,
                  },
              };

    return (


        <div className="w-full bg-white overflow-hidden">

            {/* 1. HERO SECTION */}
            <motion.section
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 md:py-16 grid md:grid-cols-2 gap-8 md:gap-12 items-center"
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView={shouldReduceMotion ? undefined : 'show'}
                variants={staggerContainer}
                viewport={{ once: false, amount: 0.2 }}
            >
                <motion.div variants={staggerItem}>
                    <motion.span
                        className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full text-xs uppercase tracking-wider inline-flex"
                        animate={shouldReduceMotion ? undefined : { y: [0, -2, 0] }}
                        transition={shouldReduceMotion ? undefined : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        Support Center
                    </motion.span>
                    <motion.h1 className="text-4xl sm:text-5xl font-extrabold mt-6 leading-tight text-slate-900" variants={staggerItem}>
                        We&apos;re Here to <br /><span className="text-blue-600">Help.</span>
                    </motion.h1>
                    <motion.p className="mt-6 text-slate-500 text-base sm:text-lg leading-relaxed max-w-md" variants={staggerItem}>
                        Whether you&apos;re looking for technical support, billing inquiries,
                        or just want to say hi, our community-focused team is ready to assist.
                    </motion.p>
                </motion.div>

                <motion.div className="relative flex justify-center" variants={staggerItem} animate={float(10, 7, 0.2)}>
                    <div className="relative w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[520px] aspect-4/3">
                        <motion.div
                            className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-blue-100 blur-2xl opacity-70"
                            animate={drift(-10, 8, 14, 0)}
                        />
                        <motion.div
                            className="absolute inset-0 rounded-[24px] sm:rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl z-10"
                            animate={shouldReduceMotion ? undefined : { rotate: [0.5, -0.5, 0.5] }}
                            transition={shouldReduceMotion ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <Image
                                src="/images/teams/contact-team.png"
                                alt="Support team working"
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </motion.section>



            {/* 2. FORM & INFO SECTION */}
            <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12" {...fadeUp(0.08)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Contact Form */}
                    <motion.div
                        className="lg:col-span-2 bg-white border border-slate-100 shadow-sm rounded-3xl p-5 sm:p-8 md:p-12"
                        {...fadeUp(0.12)}
                    >
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">Send us a message</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                    <input type="text" placeholder="PUSOM" className="w-full bg-slate-50 border-none rounded-xl p-4 text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-100 transition" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                                    <input type="email" placeholder="pusom@example.com" className="w-full bg-slate-50 border-none rounded-xl p-4 text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-100 transition" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</label>
                                <select className="w-full bg-slate-50 border-none rounded-xl p-4 text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition appearance-none">
                                    <option>General Inquiry</option>
                                    <option>Technical Support</option>
                                    <option>Billing</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Message</label>
                                <textarea rows={4} placeholder="How can we help you today?" className="w-full bg-slate-50 border-none rounded-xl p-4 text-slate-900 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-100 transition resize-none"></textarea>
                            </div>

                            <motion.button
                                type="submit"
                                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 w-full sm:w-auto"
                                animate={shouldReduceMotion ? undefined : { scale: [1, 1.02, 1] }}
                                transition={shouldReduceMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                            >
                                Send Message
                            </motion.button>
                        </form>
                    </motion.div>



                    {/* Quick Info Cards */}
                    <motion.div
                        className="space-y-4 sm:space-y-5"
                        initial={shouldReduceMotion ? false : 'hidden'}
                        whileInView={shouldReduceMotion ? undefined : 'show'}
                        viewport={{ once: false, amount: 0.2 }}
                        variants={staggerContainer}
                    >
                        {[
                            { icon: <Mail size={20} />, title: 'Email Support', detail: 'Replacement.Service168@gmail.com', sub: '24-hour response guarantee', link: null },
                            { icon: <HelpCircle size={20} />, title: 'Help Center', detail: 'Browse our knowledge base', sub: null, link: 'Visit Help Center' },
                            { icon: <ShieldCheck size={20} />, title: 'Safety Portal', detail: 'Reporting and community guidelines', sub: null, link: 'Safety Resources' },
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                className="bg-blue-50/50 border border-blue-50 p-5 sm:p-6 rounded-3xl group cursor-pointer hover:bg-blue-50 transition"
                                variants={staggerItem}
                                animate={float(4, 5.5, i * 0.25)}
                            >
                                <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                                    {card.icon}
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">{card.title}</h3>
                                <p className="text-sm text-slate-600 mb-1 break-words">{card.detail}</p>
                                {card.sub && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{card.sub}</p>}
                                {card.link && (
                                    <div className="flex items-center gap-2 text-blue-600 text-xs font-bold mt-2">
                                        {card.link} <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* 3. COMMON QUESTIONS (FAQ) */}
            <motion.section className="py-16 sm:py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" {...fadeUp(0.08)}>
                <motion.div className="text-center mb-12 md:mb-16" {...fadeUp(0.05)}>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Common Questions</h2>
                    <motion.p
                        className="text-slate-500 mt-4 max-w-lg mx-auto"
                        animate={shouldReduceMotion ? undefined : { opacity: [0.8, 1, 0.8] }}
                        transition={shouldReduceMotion ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        Quick answers to the questions we get asked most often. Save time and get back to what matters.
                    </motion.p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
                    initial={shouldReduceMotion ? false : 'hidden'}
                    whileInView={shouldReduceMotion ? undefined : 'show'}
                    viewport={{ once: false, amount: 0.2 }}
                    variants={staggerContainer}
                >
                    {[
                        { q: 'How do I get a refund?', a: 'Refunds can be requested directly through your transaction history within 48 hours of task completion for reviewed cases.' },
                        { q: 'How is my data protected?', a: 'We use AES-256 encryption and never share your personal contact details with third parties without explicit consent.' },
                        { q: 'Is there a mobile app?', a: 'No! not yet.TaskExchange is available on computer devices platform but iOS and Android platforms are coming soon.' },
                        { q: 'How do I verify my account?', a: 'Head to settings > Identity and upload a government-issued ID. Verification usually takes less than 24 hours.' },
                        { q: 'What are the service fees?', a: 'We charge a flat 5% platform fee to ensure quality control, dispute resolution, and 24/7 community support.' },
                        { q: 'Can I change my task details?', a: 'As long as the task hasn\'t been accepted by a provider, you can edit all details from your dashboard.' },
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            className="p-6 sm:p-8 rounded-3xl border border-slate-50 hover:bg-orange-100 transition"
                            variants={staggerItem}
                            animate={float(3, 6 + (i % 3), i * 0.15)}
                        >
                            <h4 className="font-bold text-blue-600 mb-3 text-sm">{item.q}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{item.a}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>
        </div>
    );
}