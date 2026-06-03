"use client";

import { useState } from "react";
import CategoryDropdown from "./CategoryDropdown";
import FormSection from "./FormSection";
import { FileText, LocateFixed, MapPin, Navigation, Tag, X } from "lucide-react";
import dynamic from "next/dynamic";


const TaskLocationPicker = dynamic(
  () => import("../map/TaskLocationPicker"),
  {
    ssr: false,
  },
);

type Props = {
  form: any;
  onChange: (name: string, value: any) => void;
};

export default function TaskDetailsForm({ form, onChange }: Props) {
  const fieldClass =
    "w-full rounded-2xl border border-sky-200 bg-sky-50/60 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100";
  const [showMap, setShowMap] = useState(false);
  const hasCoordinates = Boolean(form.latitude && form.longitude);

  const updateManualLocation = (value: string) => {
    onChange("locationText", value);
  };

  const clearCoordinates = () => {
    onChange("latitude", undefined);
    onChange("longitude", undefined);
  };

  return (
    <div className="space-y-5">
      <FormSection
        title="Task Title"
        description="Keep it short, specific, and easy to scan."
        icon={<FileText size={18} />}
      >
        <input
          type="text"
          className={fieldClass}
          placeholder="Example: Edit a research report"
          value={form.title || ""}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </FormSection>

      <FormSection
        title="Category & Location"
        description="Help workers understand the type of work and where it happens."
        icon={<Tag size={18} />}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Category
            </label>
            <CategoryDropdown
              value={form.categoryId ?? ""}
              onChange={(value) => onChange("categoryId", value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-slate-700">
              Location
            </label>

            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500"
              />

              <input
                type="text"
                className={`${fieldClass} pl-10`}
                placeholder="Example: Phnom Penh, BKK1"
                value={form.locationText || ""}
                onChange={(e) => updateManualLocation(e.target.value)}
              />
            </div>

            <div className="mt-3 rounded-2xl border border-sky-100 bg-white p-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                    Map Coordinates
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {hasCoordinates && (
                    <button
                      type="button"
                      onClick={clearCoordinates}
                      className="inline-flex h-10 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
                    >
                      <X size={14} />
                      Clear pin
                    </button>
                  )}
                  <button
                    type="button"
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 text-sm font-bold text-sky-700 transition hover:bg-sky-100"
                    onClick={() => setShowMap(true)}
                  >
                    <LocateFixed size={15} />
                    Pick from map
                  </button>
                </div>
              </div>
            </div>

            {showMap && (
              <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md">
                <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-sky-100 bg-white p-4 shadow-[0_30px_80px_rgba(15,23,42,0.35)]">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                        Location Pin
                      </p>
                      <h3 className="mt-1 text-xl font-black text-slate-950">
                        Select Location
                      </h3>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        Click the map or use current location to update both coordinates and address text.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowMap(false)}
                      className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                      aria-label="Close location picker"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <TaskLocationPicker
                    latitude={form.latitude}
                    longitude={form.longitude}
                    onChange={async (lat, lng) => {
                      onChange("latitude", lat);
                      onChange("longitude", lng);

                      try {
                        const res = await fetch(
                          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
                          { headers: { "Accept-Language": "en" } },
                        );

                        const data = await res.json();

                        onChange(
                          "locationText",
                          data.display_name || "",
                        );
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    onConfirm={() => {
                      setShowMap(false);
                    }}
                  />

                  <button
                    onClick={() => setShowMap(false)}
                    className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Navigation size={15} />
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Detailed Description"
        description="Add requirements, timing, files, tools, and what a good result looks like."
        icon={<FileText size={18} />}
      >
        <textarea
          className={`${fieldClass} min-h-36 resize-y leading-6`}
          placeholder="Describe the work clearly: what you need, where it happens, and any expectations."
          rows={5}
          value={form.description || ""}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </FormSection>
    </div>
  );
}
