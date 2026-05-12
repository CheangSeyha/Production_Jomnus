"use client";

import React, { useState } from 'react';
import { Search, BookOpen, User, CreditCard, ShieldCheck, ChevronRight, LifeBuoy } from 'lucide-react';

const categories = [
  { id: 'start', title: 'Getting Started', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'account', title: 'My Account', icon: User, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'payment', title: 'Payments & Pricing', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'safety', title: 'Trust & Safety', icon: ShieldCheck, color: 'text-red-600', bg: 'bg-red-50' },
];

export default function SupportPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Help & Support</h1>
        <p className="text-slate-500">Find answers and guides for using Jomnuos</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input 
          className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          placeholder="Search for help..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => (
          <button key={cat.id} className="flex items-center justify-between p-5 bg-white rounded-xl border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-4">
              <div className={`${cat.bg} p-3 rounded-lg ${cat.color}`}>
                <cat.icon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-slate-700">{cat.title}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
          </button>
        ))}
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <LifeBuoy className="w-5 h-5 text-blue-600" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="group border-b border-slate-50 pb-4 cursor-pointer">
            <summary className="list-none font-medium text-slate-700 group-hover:text-blue-600 flex justify-between items-center">
              How do I receive payments for tasks?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
            </summary>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Once you complete a task and the requester approves your proof, funds are released to your Jomnuos wallet. You can withdraw them to your linked bank account.
            </p>
          </details>
          <details className="group border-b border-slate-50 pb-4 cursor-pointer">
            <summary className="list-none font-medium text-slate-700 group-hover:text-blue-600 flex justify-between items-center">
              Identity verification rejected?
              <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
            </summary>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Common reasons include blurry photos or name mismatches. Please ensure your ID is valid and clearly visible in the photo.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}