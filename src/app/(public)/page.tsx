"use client";
import React from 'react';
import {
  ShieldCheck,
  Star,
  MessageSquare,
  PlusCircle,
  Search,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

export default function MainBody() {
  const shouldReduceMotion = useReducedMotion();
  const router = useRouter();

  const fadeUp = (delay = 0) => ({
    initial: shouldReduceMotion ? {} : { opacity: 0, y: 20 },
    whileInView: shouldReduceMotion ? {} : { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
    viewport: { amount: 0.2 }
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
    hidden: shouldReduceMotion ? {} : { opacity: 0, y: 18 },
    show: shouldReduceMotion ? {} : { opacity: 1, y: 0 },
  };


  return (

      <div className="w-full">


        {/* 1. HERO SECTION */}
        <motion.section
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20 grid md:grid-cols-2 gap-8 md:gap-12 items-center"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "show"}
            variants={staggerContainer}
            viewport={{ once: false, amount: 0.2 }}
        >

          <motion.div className="order-2 md:order-1" variants={staggerItem}>

          <motion.span
            className="text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full text-xs uppercase tracking-wider inline-flex"
            variants={staggerItem}
          >
            Community Powered Platform
          </motion.span>

            {/*content*/}
            <motion.h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mt-6 leading-[1.1] text-slate-900" variants={staggerItem}>
              The Marketplace <br />
              for <span className="text-blue-600">Every</span> <span className="text-orange-500">Task</span>
            </motion.h1>

            <motion.p className="mt-6 text-slate-500 text-base sm:text-lg max-w-md leading-relaxed" variants={staggerItem}>
              Join a trusted ecosystem where local experts handle your errands,
              deliveries, and creative needs with professional care.
            </motion.p>

            {/*buttons*/}
            <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8" variants={staggerItem}>

              <motion.button
                type="button"
                onClick={() => router.push("/auth/register")}
                className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 w-full sm:w-auto"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              >
                Post a Task
              </motion.button>

              <motion.button
                type="button"
                onClick={() => router.push("/auth/register")}
                className="bg-orange-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200 w-full sm:w-auto"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
              >
                Complete a Task
              </motion.button>

            </motion.div>

          </motion.div>


          {/*logo card decor*/}
          <motion.div
            className="order-1 md:order-2 relative flex justify-center"
            variants={staggerItem}
            transition={shouldReduceMotion ? undefined : { type: "spring", stiffness: 130, damping: 16 }}
          >


            <div className="relative w-full max-w-[320px] sm:max-w-105 lg:max-w-120 aspect-square">

              <div className="bg-blue-200 rounded-[10px] sm:rounded-[48px] lg:rounded-[60px] w-full h-full grid place-items-center relative overflow-hidden z-0"></div>

              <motion.div
                  className="absolute inset-0 flex items-center justify-center z-10"
                  animate={shouldReduceMotion ? undefined : { rotate: [6, 10, 6] }}
                  transition={shouldReduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: "linear" }}
              >

                <div className="bg-orange-400 w-[85%] h-[85%] rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center shadow-2xl">

                  <Image
                      src="/images/jomnus.png"
                      alt="jomnus"
                      width={900}
                      height={70}
                      className="rounded-md w-[90%] h-auto"
                  />

                </div>

              </motion.div>

            </div>

          </motion.div>

        </motion.section>


        {/* 2. HOW IT WORKS */}
        <motion.section className="py-16 sm:py-20 md:py-24 bg-slate-50/50" {...fadeUp()}>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <motion.h2 className="text-center text-2xl sm:text-3xl font-extrabold text-slate-900 mb-12 md:mb-16" {...fadeUp(0.05)}>How It Works</motion.h2>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-16"
              initial={shouldReduceMotion ? false : "hidden"}
              whileInView={shouldReduceMotion ? undefined : "show"}
              viewport={{ once: false, amount: 0.2 }}
              variants={staggerContainer}
            >

              {[

                { icon: <PlusCircle size={28} />, title: '1. Post a Task', desc: 'Describe what you need help with. Set your budget and deadline.' },
                { icon: <Search size={28} />, title: '2. Choose Your Performer', desc: 'Review profiles, ratings, and portfolios of interested performers.' },
                { icon: <ShieldCheck size={28} />, title: '3. Task Done & Verified', desc: 'Payment is released only after you approve the completed work.' },

              ].map((step, i) => (

                  <motion.div key={i} className="text-center flex flex-col items-center group" variants={staggerItem}>

                    <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition duration-300">
                      {step.icon}
                    </div>

                    <h3 className="font-bold text-xl mb-3 text-slate-900">{step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-[260px]">{step.desc}</p>

                  </motion.div>
              ))}

            </motion.div>

          </div>

        </motion.section>



        {/* 3. INTEGRITY SECTION */}
        <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-24 grid md:grid-cols-2 gap-10 lg:gap-20 items-center" {...fadeUp()}>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "show"}
            viewport={{ once: false, amount: 0.2 }}
            variants={staggerContainer}
          >

            <motion.div className="bg-[#FFF4E5] p-6 sm:p-8 rounded-3xl border border-orange-50 transform sm:translate-y-4" variants={staggerItem}>

              <ShieldCheck className="text-orange-500 mb-4" />

              <h4 className="font-bold text-slate-900 mb-2">ID Verification</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Built-in identity checks for every single member.</p>

            </motion.div>

            <motion.div className="bg-[#F0F7FF] p-6 sm:p-8 rounded-3xl border border-blue-50" variants={staggerItem}>

              <Star className="text-blue-500 mb-4" />

              <h4 className="font-bold text-slate-900 mb-2">Reputation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Transparent history and community systems.</p>

            </motion.div>

            <motion.div className="bg-[#F0F7FF] p-6 sm:p-8 rounded-3xl border border-blue-50 transform sm:translate-y-4" variants={staggerItem}>

              <Star className="text-blue-500 mb-4" />
              <h4 className="font-bold text-slate-900 mb-2">Reputation</h4>

              <p className="text-xs text-slate-600 leading-relaxed">Comprehensive review and community ratings.</p>

            </motion.div>

            <motion.div className="bg-[#FFF4E5] p-6 sm:p-8 rounded-3xl border border-orange-50" variants={staggerItem}>

              <MessageSquare className="text-orange-500 mb-4" />

              <h4 className="font-bold text-slate-900 mb-2">24/7 Support</h4>

              <p className="text-xs text-slate-600 leading-relaxed">Personalized dispute resolution services 24/7.</p>

            </motion.div>

          </motion.div>

          <motion.div {...fadeUp(0.12)}>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              Marketplace Integrity <br />by Design.
            </h2>

            <p className="text-slate-500 mb-8 leading-relaxed text-base sm:text-lg">
              We've built TaskExchange on a foundation of radical transparency. Our "Trusted Curator" model ensures that every interaction is backed by rigorous security protocols and a community-driven reputation engine.
            </p>

            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4">

              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <ShieldCheck size={20} />
              </div>

              <span className="text-sm font-semibold text-slate-700">
               Over 1k tasks completed with 99.9% satisfaction rate.
             </span>

            </div>

          </motion.div>


        </motion.section>



        {/* 4. TOP PERFORMERS */}
        <motion.section className="py-16 sm:py-20 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" {...fadeUp()}>

          <motion.div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-10 md:mb-12" {...fadeUp(0.06)}>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">Meet Top Performers</h2>
              <p className="text-slate-500 mt-2">The most reliable experts in our community.</p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 self-end sm:self-auto">
              <motion.button
                className="p-3 border border-slate-200 rounded-full hover:bg-white hover:shadow-md transition"
                whileHover={shouldReduceMotion ? undefined : { x: -2, scale: 1.06 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              >
                <ArrowLeft size={20} />
              </motion.button>
              <motion.button
                className="p-3 border border-slate-200 rounded-full hover:bg-white hover:shadow-md transition"
                whileHover={shouldReduceMotion ? undefined : { x: 2, scale: 1.06 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              >
                <ArrowRight size={20} />
              </motion.button>
            </div>
          </motion.div>



          {/* Performers cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            initial={shouldReduceMotion ? false : "hidden"}
            whileInView={shouldReduceMotion ? undefined : "show"}
            viewport={{ once: false, amount: 0.2 }}
            variants={staggerContainer}
          >

            {[
              {
                name: 'MING THA',
                image: '/images/performers/mingtha.png', // optional image
                rating: '4.9 (102 tasks)',
                success: '100%',
                response: '5 mins',
                tags: ['Delivery', 'Errands'],
              },
              {
                name: 'PU SOM',
                image: '/images/performers/pusom.png',
                rating: '5.0 (135 tasks)',
                success: '98%',
                response: '12 mins',
                tags: ['Photography', 'Events'],
              },
              {
                name: 'BRO UN',
                image: '/images/performers/jongun.png',
                rating: '4.8 (85 tasks)',
                success: '99%',
                response: '3 mins',
                tags: ['Cleaning', 'Assistant'],
              },

            ].map((user, i) => (

                <motion.div
                    key={i}
                    className="bg-white p-6 sm:p-8 rounded-4xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300"
                    variants={staggerItem}
                >



                  {/* Performer Info */}
                  <div className="flex items-center gap-4 mb-6">
                    {/* Image or Placeholder */}
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-200">
                      {user.image && (
                          <Image
                              src={user.image}
                              alt={user.name}
                              width={56}
                              height={56}
                              className="object-cover"
                          />
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900">{user.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-orange-400 text-orange-400" />
                        <p className="text-xs text-slate-700">{user.rating}</p>
                      </div>
                    </div>
                  </div>


                  {/* Performer tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {user.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                    ))}
                  </div>


                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">
                        Success Rate
                      </p>
                      <p className="text-blue-600 text-lg font-bold">{user.success}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">
                        Avg Response
                      </p>
                      <p className="text-blue-600 text-lg font-bold">{user.response}</p>
                    </div>
                  </div>
                </motion.div>
            ))}
          </motion.div>

        </motion.section>


        {/* 5. CTA SECTION */}
        <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24" {...fadeUp()}>

          <motion.div className="bg-blue-600 rounded-[28px] sm:rounded-[40px] lg:rounded-[50px] py-12 sm:py-16 md:py-20 px-5 sm:px-8 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200" {...fadeUp(0.06)}>

            {/* circles in the box */}
            <div className="absolute top-0 right-0 w-52 h-52 sm:w-80 sm:h-80 bg-orange-400 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32 opacity-20" />
            <div className="absolute bottom-0 left-0 w-28 h-28 sm:w-40 sm:h-40 bg-orange-400 rounded-full -ml-12 sm:-ml-16 -mb-12 sm:-mb-16 opacity-10" />

            {/*content*/}
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6">Ready to get things done?</h2>
              <p className="text-blue-100 text-base sm:text-lg mb-8 sm:mb-10 opacity-90">
                Join the TaskExchange community today and reclaim your time.
                Get professional help for any task, big or small.
              </p>


              <motion.button
                  type="button"
                  onClick={() => router.push("/auth/register")}
                className="bg-white text-blue-600 px-10 sm:px-12 py-4 rounded-2xl font-black text-base sm:text-lg hover:bg-blue-50 transition transform hover:scale-105 shadow-xl w-full sm:w-auto"
                animate={
                  shouldReduceMotion
                    ? undefined
                    : { scale: [1, 1.03, 1] }
                }
                transition={
                  shouldReduceMotion
                    ? undefined
                    : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                }
                whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              >
                Start Today
              </motion.button>


            </div>

          </motion.div>

        </motion.section>

      </div>
  );
}


