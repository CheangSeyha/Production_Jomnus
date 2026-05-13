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
}: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="mx-auto flex-1 px-4 py-8 sm:px-6 lg:max-w-4xl lg:py-10">
        {children}
      </div>

      {draftTasks && (
        <aside className="hidden w-80 overflow-y-auto border-l border-slate-200 bg-white p-6 lg:block">
          {draftTasks}
        </aside>
      )}
    </div>
  );
}
