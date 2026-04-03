"use client"; // needed for usePathname
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname(); // get current path

    // Define your links
    const links = [
        { name: "Home", href: "/" },
        { name: "About Us", href: "/aboutUs" },
        { name: "Contact Us", href: "/contactUs" },
        { name: "Blog", href: "/blog" },
    ];

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 w-full h-22 bg-white shadow-sm">
            <div className="flex items-center gap-10">
                {/* Logo */}
                <div>
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={140}
                        height={48}
                        className="rounded-md"
                    />
                </div>

                {/* Desktop Links */}
                <div className="hidden md:flex gap-6 text-m font-medium text-black-100">
                    {links.map((link) => {
                        const isActive = pathname === link.href; // check if current page
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`transition ${
                                    isActive ? "text-blue-600 font-bold" : "hover:text-blue-600"
                                }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium">
        {/*<span className="cursor-pointer text-slate-500 hover:text-slate-900">*/}
        {/*  English (US)*/}
        {/*</span>*/}
                <button className="text-slate-600 px-3 py-2 hover:bg-slate-50 rounded-lg">
                    Log In
                </button>
                <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
                    Sign Up
                </button>
            </div>
        </nav>
    );
}