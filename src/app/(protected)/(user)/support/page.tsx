"use client";

import { LifeBuoy } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="min-h-screen overflow-y-auto bg-slate-50 p-6 md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className=" space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Help & Support
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Get assistance with tasks, payments, and account settings.
          </p>
        </div>

        {/* Content Box */}
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-slate-100 bg-white p-12 text-center shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <LifeBuoy size={32} />
          </div>
          <h2 className="mb-2 text-xl font-bold text-slate-800">
            Support Center Coming Soon
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-slate-500">
            We are currently building out our knowledge base and ticketing system. 
            If you have an urgent issue, please reach out to an administrator directly.
          </p>
        </div>
      </div>
    </div>
  );
}