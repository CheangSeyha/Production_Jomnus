"use client";

export default function FormSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        {icon && (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
          {description && (
            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}
