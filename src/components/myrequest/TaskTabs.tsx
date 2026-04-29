"use client";

import { ChevronDown } from "lucide-react";

type TabsProps = {
  tabs: Array<{
    id: string;
    label: string;
    count?: number;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

export default function TaskTabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
