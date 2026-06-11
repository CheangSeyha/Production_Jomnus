"use client";

import React from 'react';
import { ShieldCheck, Users, Star, Eye } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import {router} from "next/client";
import {useRouter} from "next/navigation";


export default function AboutUsBody() {
    const shouldReduceMotion = useReducedMotion();
    const router = useRouter();

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

    const drift = (x = 12, y = 12, duration = 10, delay = 0): any =>
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
        <div className="w-full">

            {/* 1. HERO SECTION */}
            <motion.section
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 md:py-16 grid md:grid-cols-2 gap-8 md:gap-12 items-center"
                initial={shouldReduceMotion ? false : "hidden"}
                whileInView={shouldReduceMotion ? undefined : "show"}
                variants={staggerContainer}
                viewport={{ once: false, amount: 0.2 }}
            >

                {/*Content*/}
                <motion.div variants={staggerItem}>
                    <span className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                        Our Mission
                    </span>

                    <h1 className="text-4xl sm:text-5xl font-extrabold mt-6 leading-tight text-slate-900">
                        Connecting <br />Peoples to help people.
                    </h1>

                    <p className="mt-6 text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg">
                        We created this platform to connect people who need help with
                        trusted local experts. It's about building a community where
                        individuals can support each other, share their skills, and earn
                        money doing what they love.
                    </p>

                </motion.div>

                {/*Photo*/}
                <motion.div className="relative" variants={staggerItem} animate={float(10, 7, 0.2)}>
                    <motion.div
                        className="rounded-[40px] overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500"
                        animate={shouldReduceMotion ? undefined : { rotate: [2, 0, 2] }}
                        transition={shouldReduceMotion ? undefined : { duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <img
                            src="/images/teams/team.png"
                            alt="Team collaboration"
                            className="w-full h-auto object-cover aspect-4/3"
                        />
                    </motion.div>
                </motion.div>


            </motion.section>




            {/* 2. ORIGIN STORY */}
            <motion.section className="bg-slate-50 py-16 sm:py-20 md:py-24" {...fadeUp()}>

                <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 md:gap-16 items-start" {...fadeUp(0.06)}>
                    <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight text-slate-900">
                        Born from a simple <br />
                        need: <span className="text-blue-600">connection</span> <br />
                        and <span className="text-orange-500">trust</span>.
                    </h2>

                    <motion.div className="space-y-6 text-slate-600 leading-relaxed" {...fadeUp(0.12)}>

                        <p>
                            Our platform was created after recognizing that many people have
                            skills and want to help, while others have tasks and lack the
                            time or expertise to complete them.
                        </p>
                        <p>
                            We wanted a community where people can support each other.
                            ជំនួស (JOMNUS) was born out of a desire to create a trusted space
                            where collaboration strengthens both individuals and the community.
                        </p>

                    </motion.div>
                </motion.div>
            </motion.section>



            {/* 3. VALUES SECTION */}
            <motion.section className="py-16 sm:py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" {...fadeUp()}>

                <motion.div className="text-center mb-16" {...fadeUp(0.04)}>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Values that Drive Us</h2>
                    <motion.div
                        className="w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full"
                        animate={shouldReduceMotion ? undefined : { scaleX: [1, 1.18, 1] }}
                        transition={shouldReduceMotion ? undefined : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </motion.div>


                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8"
                    initial={shouldReduceMotion ? false : 'hidden'}
                    whileInView={shouldReduceMotion ? undefined : 'show'}
                    viewport={{ once: false, amount: 0.2 }}
                    variants={staggerContainer}
                >
                    {[
                        { icon: <ShieldCheck className="text-orange-500" />, title: 'Trust & Safety', desc: 'Security is our top priority. We verify identities to ensure a safe environment.' },
                        { icon: <Users className="text-orange-500" />, title: 'Community Growth', desc: 'We foster a culture of mutual support and shared success.' },
                        { icon: <Star className="text-orange-500" />, title: 'Professional Excellence', desc: 'High standards in every task delivered within our marketplace.' },
                        { icon: <Eye className="text-orange-500" />, title: 'Radical Transparency', desc: 'Clear communication and honest feedback build lasting trust.' },
                    ].map((value, i) => (

                        <motion.div key={i} className="flex flex-col items-start" variants={staggerItem} animate={float(4, 5.5, i * 0.25)}>

                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                                {value.icon}
                            </div>

                            <h3 className="font-bold text-slate-900 mb-3">{value.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>


                        </motion.div>
                    ))}
                </motion.div>


            </motion.section>



            {/* 4. STATS BANNER */}
            <motion.section className="bg-blue-600 py-14 sm:py-16 relative overflow-hidden" {...fadeUp()}>

                <motion.div
                    className="absolute top-1/2 left-0 w-48 h-48 rounded-full bg-orange-300/15 -translate-y-1/2"
                    animate={drift(20, 10, 12, 0)}
                />
                <motion.div
                    className="absolute top-0 right-0 w-40 h-40 rounded-full bg-orange-300/15 -mr-12 -mt-12"
                    animate={drift(-16, 14, 13, 0.4)}
                />

                <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 text-center text-white" {...fadeUp(0.08)}>

                    <div>
                        <div className="text-4xl sm:text-5xl font-black mb-2">1k+</div>
                        <div className="text-blue-100 text-sm font-bold uppercase tracking-widest">Tasks Completed</div>
                    </div>

                    <div>
                        <div className="text-4xl sm:text-5xl font-black mb-2">100</div>
                        <div className="text-blue-100 text-sm font-bold uppercase tracking-widest">Expert Performers</div>
                    </div>

                    <div>
                        <div className="text-4xl sm:text-5xl font-black mb-2">24/7</div>
                        <div className="text-blue-100 text-sm font-bold uppercase tracking-widest">Customer Support</div>
                    </div>

                </motion.div>


            </motion.section>



            {/* 5. THE VISIONARIES (TEAM) */}
            <motion.section className="py-16 sm:py-20 md:py-24 bg-blue-50/30" {...fadeUp()}>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    <motion.div className="mb-16" {...fadeUp(0.05)}>

                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">The Visionaries</h2>
                        <p className="text-slate-500 mt-2">Meet the team dedicated to making this vision a reality.</p>
                    </motion.div>


                    <motion.div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
                        initial={shouldReduceMotion ? false : 'hidden'}
                        whileInView={shouldReduceMotion ? undefined : 'show'}
                        viewport={{ once: false, amount: 0.2 }}
                        variants={staggerContainer}
                    >
                        {visionaries.map((member, i) => (

                            <motion.div key={i} className="group" variants={staggerItem} animate={float(5, 6.5, i * 0.18)}>

                                <div className={`${member.color} w-full aspect-square rounded-2xl sm:rounded-3xl mb-3 sm:mb-4 flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden transition-all group-hover:shadow-lg group-hover:-translate-y-1`}>
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (

                                        <div className="w-2/3 h-2/3 bg-slate-200/50 rounded-full flex items-center justify-center italic text-slate-400 text-xs">
                                            No Photo
                                        </div>
                                    )}
                                </div>
                                <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wide">
                                    {member.name}
                                </h4>
                                <p className="text-blue-600 text-[11px] font-bold">
                                    {member.role}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/*join*/}
            <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 md:py-20" {...fadeUp()}>

                <motion.div className="bg-orange-400 rounded-[24px] sm:rounded-[32px] md:rounded-[40px] p-6 sm:p-10 md:p-12 text-center text-white relative overflow-hidden" {...fadeUp(0.06)}>

                    <motion.div
                        className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-16 -mt-16"
                        animate={drift(8, 8, 8, 0.2)}
                    />
                    <motion.div
                        className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 rounded-full -ml-16 -mb-16"
                        animate={drift(-8, 8, 9, 0.5)}
                    />

                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 relative z-10">Join the Movement</h2>

                    <p className="text-orange-50 text-sm sm:text-base mb-8 sm:mb-10 max-w-lg mx-auto relative z-10 leading-relaxed">
                        Experience the next generation of community-driven task management.
                        Secure, trusted, and local.
                    </p>

                    <motion.button
                        className="bg-white text-orange-500 px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl font-bold hover:bg-orange-50 transition relative z-10 shadow-xl w-full sm:w-auto"
                        animate={shouldReduceMotion ? undefined : { scale: [1, 1.04, 1] }}
                        transition={shouldReduceMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
                        whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                        onClick={() => router.push("/auth/register")}
                    >
                        Join Us Now
                    </motion.button>

                </motion.div>

            </motion.section>

        </div>
    );
}


const visionaries = [

    {
        name: 'RABY',
        role: 'CEO',
        color: 'bg-[#FDF2E9]',
        image: '/images/teams/raby.png',
    },
    {
        name: 'SEYHA',
        role: 'CTO',
        color: 'bg-[#FDF2E9]',
        image: '/images/teams/seyha.png'
    },
    {
        name: 'SREYPI',
        role: 'CDO',
        color: 'bg-[#FDF2E9]',
        image: '/images/teams/sreypi.png'
    },
    {
        name: 'KANHA',
        role: 'CIO',
        color: 'bg-[#FDF2E9]',
        image: '/images/teams/kanha.png'
    },
    {
        name: 'RASY',
        role: 'CISO',
        color: 'bg-[#FDF2E9]',
        image: '/images/teams/rasy.png'
    },
    {
        name: 'HOKLENG',
        role: 'COO',
        color: 'bg-[#FDF2E9]',
        image: '/images/teams/leng.png'
    },
    {
        name: 'THEARO',
        role: 'CFO',
        color: 'bg-[#FDF2E9]',
        image: '/images/teams/ro.png'
    },

];