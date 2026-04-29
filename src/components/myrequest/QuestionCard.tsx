"use client";

import { User, MessageCircle, ChevronDown } from "lucide-react";
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
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
            <User size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900">{workerName}</p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{question}</p>
            <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
          </div>
          <ChevronDown
            size={20}
            className={`text-gray-400 flex-shrink-0 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Full Question:</p>
            <p className="text-sm text-gray-600">{question}</p>
          </div>

          {isAnswered && answer ? (
            <div className="bg-white border border-green-200 rounded p-3">
              <p className="text-sm font-medium text-green-900 mb-1">Your Answer:</p>
              <p className="text-sm text-gray-700">{answer}</p>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your answer..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Reply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
