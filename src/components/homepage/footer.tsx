import React from "react";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50 pt-20 pb-10 border-t border-slate-100 mt-auto">
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-5 gap-12">
        {/* Branding Column */}
        <div className="col-span-2">
          <div>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={200}
              height={50}
              className="rounded-md"
            />
          </div>

          <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
            The community-powered platform where local experts handle your
            errands, deliveries, and creative needs with professional care and
            radical transparency.
          </p>
        </div>

        {/* Links Columns */}
        <div>
          <h5 className="font-bold mb-4 text-slate-900">Company</h5>
          <ul className="text-slate-500 text-sm space-y-2">
            <li className="hover:text-blue-600 cursor-pointer">Home</li>
            <li className="hover:text-blue-600 cursor-pointer">About Us</li>
            <li className="hover:text-blue-600 cursor-pointer">Contact Us</li>
            <li className="hover:text-blue-600 cursor-pointer">Blog</li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4 text-slate-900">Product</h5>
          <ul className="text-slate-500 text-sm space-y-2">
            <li className="hover:text-blue-600 cursor-pointer">Browse Tasks</li>
            <li className="hover:text-blue-600 cursor-pointer">
              Become a Performer
            </li>
            <li className="hover:text-blue-600 cursor-pointer">Pricing</li>
            <li className="hover:text-blue-600 cursor-pointer">Partner</li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4 text-slate-900">Support</h5>
          <ul className="text-slate-500 text-sm space-y-2">
            <li className="hover:text-blue-600 cursor-pointer">Help Center</li>
            <li className="hover:text-blue-600 cursor-pointer">Safety Tips</li>
            <li className="hover:text-blue-600 cursor-pointer">
              Terms of Service
            </li>
            <li className="hover:text-blue-600 cursor-pointer">
              Privacy Policy
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter and Copyright Section */}
      <div className="max-w-7xl mx-auto px-8 mt-16">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h6 className="font-bold text-sm text-slate-900">
              Join our newsletter
            </h6>
            <p className="text-xs text-slate-400">
              Get the latest updates and community tips delivered to your inbox.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-slate-50 px-4 py-2 rounded-lg text-sm outline-none border border-transparent focus:border-blue-300 w-full md:w-64"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap hover:bg-blue-700">
              Subscribe Now
            </button>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-12">
          © {currentYear} TaskExchange Marketplace. All rights reserved. Trusted
          Curator for Every Task.
        </p>
      </div>
    </footer>
  );
}
