"use client";

import { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
};

export default function FormSection({ title, icon, children }: FormSectionProps) {
  return (
    <div className="mb-8 pb-8 border-b border-gray-200 last:border-b-0">
      <div className="flex items-center gap-3 mb-6">
        {icon && <div className="text-blue-600">{icon}</div>}
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}
