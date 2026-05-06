import React from "react";
import Image from "next/image";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-slate-900 text-slate-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
                {/* Main Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
                    {/* Branding */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                        <Image
                            src="/images/logo.png"
                            alt="Logo"
                            width={120}
                            height={32}
                            className="object-contain w-24 md:w-32 mb-4"
                            style={{ height: "auto", filter: "brightness(0) invert(1)" }}
                        />
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            Connect with local experts. Get tasks done with professional care and radical transparency.
                        </p>
                    </div>

                    {/* Company */}
                    <div>
                        <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Company</h5>
                        <ul className="space-y-2.5 text-sm">
                            <li><a href="#" className="text-slate-400 hover:text-white transition">Home</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white transition">About</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white transition">Contact</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white transition">Blog</a></li>
                        </ul>
                    </div>

                    {/* Product */}
                    <div>
                        <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Product</h5>
                        <ul className="space-y-2.5 text-sm">
                            <li><a href="#" className="text-slate-400 hover:text-white transition">Browse</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white transition">Become Expert</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white transition">Pricing</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white transition">Partners</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Support</h5>
                        <ul className="space-y-2.5 text-sm">
                            <li><a href="#" className="text-slate-400 hover:text-white transition">Help</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white transition">Safety</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white transition">Terms</a></li>
                            <li><a href="#" className="text-slate-400 hover:text-white transition">Privacy</a></li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 md:p-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div>
                            <h6 className="font-bold text-white text-lg mb-1">Stay updated</h6>
                            <p className="text-slate-300 text-sm">Get the latest updates and tips delivered to your inbox.</p>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 bg-slate-900/50 px-4 py-2.5 rounded-lg text-sm text-white placeholder-slate-500 border border-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                            />
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
                    <p>© {currentYear} TaskExchange. All rights reserved.</p>
                    <div className="flex gap-6 text-slate-300">
                        <a href="#" className="hover:text-white transition">Terms</a>
                        <a href="#" className="hover:text-white transition">Privacy</a>
                        <a href="#" className="hover:text-white transition">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
