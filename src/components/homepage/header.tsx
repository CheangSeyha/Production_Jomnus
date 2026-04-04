"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu after route changes.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Define your links
  const links = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/aboutUs" },
    { name: "Contact Us", href: "/contactUs" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full border-b border-slate-200/70 bg-white/90 shadow-[0_6px_24px_rgba(15,23,42,0.06)] backdrop-blur-md">
      <nav className="flex h-22 w-full items-center justify-between px-4 py-4 sm:px-6 md:mx-auto md:max-w-7xl lg:px-8">
        <div className="flex items-center gap-4 sm:gap-8 lg:gap-10">
          {/* Logo */}
          <Link href="/" aria-label="Go to home">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={140}
              height={48}
              className="h-auto w-30 rounded-md sm:w-35"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden items-center gap-2 text-sm font-semibold text-slate-700 md:flex">
            {links.map((link) => {
              const isActive = pathname === link.href; // check if current page
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`rounded-full px-3 py-2 transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "hover:bg-slate-100 hover:text-blue-600"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden items-center gap-3 text-sm font-semibold md:flex">
          {/*<span className="cursor-pointer text-slate-500 hover:text-slate-900">*/}
          {/*  English (US)*/}
          {/*</span>*/}
          <a
            href="/auth/signin"
            className="rounded-xl px-4 py-2 text-slate-700 transition hover:bg-slate-100"
          >
            Log In
          </a>
          <a
            href="/auth/register"
            className="rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-5 py-2 text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)] transition hover:from-blue-700 hover:to-blue-800"
          >
            Sign Up
          </a>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition hover:bg-slate-100 active:scale-95 md:hidden"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {isMobileMenuOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      {isMobileMenuOpen && (
        <div className="w-full border-t border-slate-100 bg-white/95 px-4 pb-4 pt-3 shadow-[0_14px_30px_rgba(15,23,42,0.12)] backdrop-blur-sm md:hidden">
          <div className="flex flex-col gap-1 text-sm font-medium">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-xl px-3 py-2.5 transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-bold"
                      : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Log In
            </button>
            <button className="rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-3 py-2.5 text-sm font-semibold text-white transition hover:from-blue-700 hover:to-blue-800">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
