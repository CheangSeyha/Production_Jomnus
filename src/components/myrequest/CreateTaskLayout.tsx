"use client";

import React from "react";

type LayoutProps = {
  children: React.ReactNode;
  draftTasks?: React.ReactNode;
  step?: number;
};

export default function CreateTaskLayout({
  children,
  draftTasks,
  step = 1,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {children}
        </div>
      </div>

      {/* Right Sidebar - Draft Tasks */}
      {draftTasks && (
        <div className="w-80 bg-gray-100 border-l border-gray-200 p-6 overflow-y-auto">
          {draftTasks}
        </div>
      )}
    </div>
  );
}
