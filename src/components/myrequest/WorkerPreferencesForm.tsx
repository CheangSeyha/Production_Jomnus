"use client";

import FormSection from "./FormSection";
import { EyeOff, MessageCircle, Settings, ShieldCheck, SlidersHorizontal, Star } from "lucide-react";

type Props = {
  form: any;
  onChange: (name: string, value: any) => void;
};

export default function WorkerPreferencesForm({ form, onChange }: Props) {
  const selectClass =
    "h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100";
  const toggleClass =
    "relative inline-flex cursor-pointer items-center";
  const toggleTrackClass =
    "h-6 w-11 rounded-full bg-slate-300 transition after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-sky-600 peer-checked:after:translate-x-full peer-focus:ring-4 peer-focus:ring-sky-100";

  return (
    <div className="space-y-5">
      <FormSection
        title="Worker Acceptance"
        description="Control how strict the worker selection should be."
        icon={<Settings size={18} />}
      >
        <div className="space-y-3">
          <button
            type="button"
            className="w-full rounded-lg border border-sky-200 bg-sky-50 p-4 text-left transition hover:bg-sky-100"
            onClick={() => onChange("autoAccept", !form.autoAccept)}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 font-semibold text-slate-950">
                  <ShieldCheck size={17} className="text-sky-700" />
                  Auto-Accept Top Rated
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Instantly hire the first available worker with a 4.5+ rating
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.autoAccept || false}
                onChange={(e) => onChange("autoAccept", e.target.checked)}
                className="mt-1 h-5 w-5 cursor-pointer accent-sky-600"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </button>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
              <Star size={17} className="text-amber-500" />
              Minimum Rating
            </p>
            <select
              value={form.minRating || "4.5"}
              onChange={(e) => onChange("minRating", e.target.value)}
              className={selectClass}
            >
              <option value="3">3.0+ stars</option>
              <option value="3.5">3.5+ stars</option>
              <option value="4">4.0+ stars</option>
              <option value="4.5">4.5+ stars</option>
              <option value="5">5.0 stars only</option>
            </select>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Specialization"
        description="Choose a specialty if the task needs a specific skill."
        icon={<SlidersHorizontal size={18} />}
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Specific Specialty
          </label>
          <select
            value={form.specialty || ""}
            onChange={(e) => onChange("specialty", e.target.value)}
            className={selectClass}
          >
            <option value="">Any specialty</option>
            <option value="writing">Creative Writing</option>
            <option value="editing">Technical Editing</option>
            <option value="research">Research</option>
            <option value="seo">SEO Optimization</option>
            <option value="copywriting">Copywriting</option>
          </select>
        </div>
      </FormSection>

      <FormSection
        title="Bidding Rules"
        description="Decide how much information workers can see before applying."
        icon={<EyeOff size={18} />}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex-1">
              <p className="font-semibold text-slate-950">Hidden Bids</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Freelancers cannot see other users' offers or terms
              </p>
            </div>
            <label className={`${toggleClass} flex-shrink-0`}>
              <input
                type="checkbox"
                checked={form.hiddenBids || false}
                onChange={(e) => onChange("hiddenBids", e.target.checked)}
                className="sr-only peer"
              />
              <div className={toggleTrackClass}></div>
            </label>
          </div>

          <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex-1">
              <p className="font-semibold text-slate-950">Minimum Rating Required</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Only workers with at least 4.5 stars can apply
              </p>
            </div>
            <label className={`${toggleClass} flex-shrink-0`}>
              <input
                type="checkbox"
                checked={form.minRatingRequired || false}
                onChange={(e) => onChange("minRatingRequired", e.target.checked)}
                className="sr-only peer"
              />
              <div className={toggleTrackClass}></div>
            </label>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Communication"
        description="Let workers ask useful questions before they submit an offer."
        icon={<MessageCircle size={18} />}
      >
        <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex-1">
            <p className="font-semibold text-slate-950">Allow Pre-bid Messaging</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Let workers ask clarifying questions before submitting a proposal
            </p>
          </div>
          <label className={`${toggleClass} flex-shrink-0`}>
            <input
              type="checkbox"
              checked={form.allowMessaging ?? true}
              onChange={(e) => onChange("allowMessaging", e.target.checked)}
              className="sr-only peer"
            />
            <div className={toggleTrackClass}></div>
          </label>
        </div>
      </FormSection>
    </div>
  );
}
