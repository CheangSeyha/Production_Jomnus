"use client";

import { ChevronDown, MessageCircle, Send, User } from "lucide-react";
import { useState } from "react";

type QuestionProps = {
  id: string;
  workerName: string;
  question: string;
  timeAgo: string;
  isAnswered?: boolean;
  answer?: string;
};

export default function QuestionCard({
  id,
  workerName,
  question,
  timeAgo,
  isAnswered = false,
  answer,
}: QuestionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left transition hover:bg-slate-50"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-sky-600 text-sm text-white">
            <User size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-slate-950">{workerName}</p>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">
              {question}
            </p>
            <p className="mt-1 text-xs text-slate-400">{timeAgo}</p>
          </div>
          <ChevronDown
            size={20}
            className={`flex-shrink-0 text-slate-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="border-t border-slate-200 bg-slate-50 p-4">
          <div className="mb-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-950">
              <MessageCircle size={16} className="text-sky-700" />
              Full Question
            </p>
            <p className="text-sm leading-6 text-slate-600">{question}</p>
          </div>

          {isAnswered && answer ? (
            <div className="rounded-lg border border-emerald-200 bg-white p-3">
              <p className="mb-1 text-sm font-semibold text-emerald-900">
                Your Answer
              </p>
              <p className="text-sm leading-6 text-slate-700">{answer}</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your answer..."
                className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-700">
                <Send size={15} />
                Reply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
