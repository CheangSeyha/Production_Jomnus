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
    <section className="rounded-3xl border border-sky-100 bg-white/95 p-5 shadow-[0_10px_30px_rgba(14,165,233,0.08)]">
      <div className="mb-5 flex items-start gap-3">
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-base font-black text-slate-950">{title}</h2>
          {description && (
            <p className="mt-1 text-sm font-medium leading-6 text-slate-500">{description}</p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}
