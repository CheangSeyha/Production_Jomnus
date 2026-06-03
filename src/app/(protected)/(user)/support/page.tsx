"use client";

import { useState } from "react";
import {
  Search,
  Book,
  CreditCard,
  User,
  Shield,
  MessageSquare,
  Mail,
  ChevronDown,
  ArrowRight,
  LifeBuoy
} from "lucide-react";

const CATEGORIES = [
  { icon: Book, title: "Getting Started", desc: "Learn the basics of using the platform." },
  { icon: CreditCard, title: "Payments & Billing", desc: "Everything about deposits, payouts, and fees." },
  { icon: User, title: "Account & Profile", desc: "Manage your settings, reviews, and identity." },
  { icon: Shield, title: "Trust & Safety", desc: "Community guidelines and dispute resolution." },
];

const FAQS = [
  {
    question: "How do I create and post a new task?",
    answer: "Navigate to the 'My Requests' tab in your sidebar and click the 'Create Request' button. Fill out the details, set your budget, and publish it to the marketplace."
  },
  {
    question: "When do I get paid for completing a task?",
    answer: "Funds are held securely in escrow while you work. Once the Requester approves your submitted proof of work, the funds are instantly released to your account balance."
  },
  {
    question: "What happens if there is a dispute?",
    answer: "If you and the other party cannot agree on the outcome of a task, you can click 'Report Issue' on the task page. Our admin team will review the communications and proofs to make a final decision."
  },
  {
    question: "How do I change my password or email?",
    answer: "Go to your 'Settings' page via the sidebar or profile dropdown. Under the 'Security' tab, you can update your credentials and manage two-factor authentication."
  }
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen space-y-8 max-w-[1200px] mx-auto p-4 md:p-8">
      
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-6 md:p-10 text-center shadow relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-blue-50 text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-2">
            <LifeBuoy size={14} />
            Support Center
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-blue-100 text-lg font-medium">
            Search our knowledge base or browse categories below to find exactly what you need.
          </p>
          
          <div className="relative mt-8 group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for articles, guides, and FAQs..."
              className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none shadow-xl focus:ring-4 focus:ring-blue-500/30 transition-all border-0"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CATEGORIES.map((category, idx) => (
          <button 
            key={idx}
            className="group flex flex-col items-start p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all text-left"
          >
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 mb-5 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <category.icon size={24} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">
              {category.title}
            </h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-4">
              {category.desc}
            </p>
            <div className="mt-auto flex items-center gap-2 text-sm font-bold text-blue-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              View Articles <ArrowRight size={16} />
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 items-start">
        
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm font-medium text-slate-500">
              Quick answers to the most common queries from our community.
            </p>
          </div>
          
          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-slate-800">{faq.question}</span>
                  <div className={`p-1.5 rounded-full transition-transform duration-300 ${openFaq === idx ? "bg-slate-100 rotate-180" : "bg-transparent"}`}>
                    <ChevronDown size={18} className="text-slate-400" />
                  </div>
                </button>
                <div 
                  className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                    openFaq === idx ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Removed the 'Still need help?' card to simplify the Support page */}

      </div>
    </div>
  );
}