"use client";

import { useState } from "react";
import {
  ChevronDown,
  LifeBuoy,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { toast } from "sonner";

const FAQS = [
  {
    question: "How do I create and post a new task request?",
    answer: "Navigate to the 'My Requests' tab in your sidebar dashboard and click the 'Create Task' button. Fill out your task title, detailed requirements, location parameters, and total budget. Once published, qualified performers in the platform will instantly be able to view and place bids on your task."
  },
  {
    question: "When do I get paid for completing a task?",
    answer: "Funds are held securely in the platform's escrow wallet system the moment a requester assigns a task to you. Once you complete the task and upload your proof of work, the requester will review it. Upon their final approval, the held funds are instantly released directly into your profile wallet balance."
  },
  {
    question: "What should I do if a user submits incomplete proof of work?",
    answer: "As a Requester, you have full control over the task verification process. If a performer submits insufficient or incorrect proof, do not click 'Approve'. Instead, use the integrated chat system to explain what needs correction, or utilize the request modification log to ask for a resubmission before releasing any funds."
  },
  {
    question: "What happens if there is a dispute or disagreement on a task outcome?",
    answer: "If a requester and a performer cannot reach an agreement regarding task completion or payouts, either party can flag the assignment to trigger a formal dispute resolution. Our admin management team will step in, review all recorded system text messages, timestamps, and uploaded hardware proofs to issue a fair, binding decision."
  },
  {
    question: "How can I update my profile details, profile picture, or system credentials?",
    answer: "Click on your profile avatar in the upper right-hand corner or select the 'Settings' tab in your main sidebar menu. From there, you can rewrite your professional bio, select your operational city, upload a high-resolution avatar image, or update your security password parameters seamlessly."
  },
  {
    question: "Why hasn't my account received the 'Identity Verified' check badge yet?",
    answer: "Identity verification requests are manually audited by our security team to ensure platform trust and safety. This review cycle usually takes between 12 to 24 business hours. You will receive an instant push alert in your system Notification Center the exact second your document verification has been approved or rejected."
  },
  {
    question: "Are there any service fees or platform charges taken from completed tasks?",
    answer: "Posting a basic task request is completely free. For performers, a minor standard platform processing fee is calculated from the final approved task payout to cover secure escrow banking and infrastructure maintenance. All exact fee summaries are clearly detailed before you place your application bid."
  },
  {
    question: "Can I cancel a task request after a performer has already been accepted?",
    answer: "If a task is actively marked as 'In Progress', cancellation rules apply to protect both sides. If you must cancel due to unforeseen emergencies, communicate directly with your worker first. If a mutual agreement cannot be reached, open a support claim so an admin can process a partial or full escrow refund based on the actual work progress completed."
  }
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [feedback, setFeedback] = useState<{ [key: number]: "up" | "down" }>({});

  const handleFeedback = (idx: number, type: "up" | "down") => {
    setFeedback((prev) => ({ ...prev, [idx]: type }));
    toast.success("Thank you for your valuable feedback!");
  };

  return (
    <div className="min-h-screen space-y-12 max-w-[1200px] mx-auto p-4 md:p-8 pb-16">
      
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 md:p-12 text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-blue-50 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <LifeBuoy size={14} />
            Help & Documentation
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Knowledge Base
          </h1>
          <p className="text-blue-100 text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto">
            Browse our comprehensive, updated support guides to master task creation, secure escrow workflows, and wallet systems.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm font-medium text-slate-400 mt-1">
            Click on a question card to reveal detailed instructional answers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden h-fit ${
                  isOpen 
                    ? "border-blue-200 shadow-md shadow-blue-50/50" 
                    : "border-slate-100 shadow-sm hover:border-slate-200"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-5.5 flex items-start justify-between text-left focus:outline-none gap-4"
                >
                  <span className={`font-bold text-base md:text-md transition-colors duration-200 leading-snug ${
                    isOpen ? "text-blue-600" : "text-slate-800"
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-xl transition-all duration-300 flex-shrink-0 ${
                    isOpen ? "bg-blue-50 text-blue-600 rotate-180" : "bg-slate-50 text-slate-400"
                  }`}>
                    <ChevronDown size={16} />
                  </div>
                </button>

                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-6 pb-6 space-y-5 border-t border-slate-50 pt-4">
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 text-xs text-slate-400 font-medium">
                      <span>Was this article helpful to you?</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFeedback(idx, "up")}
                          disabled={feedback[idx] !== undefined}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold transition-all active:scale-95 disabled:pointer-events-none ${
                            feedback[idx] === "up"
                              ? "bg-green-50 border-green-200 text-green-600"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <ThumbsUp size={12} /> Yes
                        </button>
                        <button
                          onClick={() => handleFeedback(idx, "down")}
                          disabled={feedback[idx] !== undefined}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold transition-all active:scale-95 disabled:pointer-events-none ${
                            feedback[idx] === "down"
                              ? "bg-red-50 border-red-200 text-red-600"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <ThumbsDown size={12} /> No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}