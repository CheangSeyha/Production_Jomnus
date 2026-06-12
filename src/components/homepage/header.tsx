"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const links = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/aboutUs" },
    { name: "Contact Us", href: "/contactUs" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/70">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-18 md:h-20 items-center justify-between ">
          {/* LEFT: Logo + Desktop Nav */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-8 lg:gap-12 flex-1 min-w-0">

            {/* Logo */}
            <Link href="/" aria-label="Home" className="shrink-0 inline-block">
              <Image
                src="/images/logo.png"
                alt="Jomnus"
                width={100}
                height={32}
                className="w-20 sm:w-24 md:w-28 lg:w-32 object-contain"
                style={{ height: "auto" }}
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50/80 text-blue-600"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Auth Buttons (Desktop) + Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-2 sm:gap-3">
              <a
                href="/auth/signin"
                className="px-4 lg:px-5 py-2 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors"
              >
                Log In
              </a>
              <a
                href="/auth/register"
                className="px-4 lg:px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Sign Up
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition text-slate-600"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/70 py-4 space-y-3 bg-slate-50/50">
            {/* Mobile Navigation */}
            <div className="space-y-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-slate-700 hover:bg-white hover:text-slate-900"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/70">
              <a
                href="/auth/signin"
                className="px-4 py-2.5 text-center text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Log In
              </a>
              <a
                href="/auth/register"
                className="px-4 py-2.5 text-center text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
