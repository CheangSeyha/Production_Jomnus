"use client";

import FormSection from "./FormSection";
import { Settings } from "lucide-react";

type Props = {
  form: any;
  onChange: (name: string, value: any) => void;
};

export default function WorkerPreferencesForm({ form, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* Auto-Accept Setting */}
      <FormSection title="Worker Acceptance" icon={<Settings size={20} />}>
        <div className="space-y-3">
          <div className="border border-blue-300 bg-blue-50 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors"
            onClick={() => onChange("autoAccept", !form.autoAccept)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Auto-Accept Top Rated</p>
                <p className="text-sm text-gray-600 mt-1">
                  Instantly hire the first available worker with a 4.5+ rating
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.autoAccept || false}
                onChange={(e) => onChange("autoAccept", e.target.checked)}
                className="w-6 h-6 cursor-pointer"
              />
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="font-medium text-gray-900 mb-2">Minimum Rating</p>
            <select
              value={form.minRating || "4.5"}
              onChange={(e) => onChange("minRating", e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Specialization */}
      <FormSection title="Specialization">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SPECIFIC SPECIALTY
          </label>
          <select
            value={form.specialty || ""}
            onChange={(e) => onChange("specialty", e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Bidding Rules */}
      <FormSection title="Bidding Rules">
        <div className="space-y-4">
          <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-900">Hidden Bids</p>
              <p className="text-sm text-gray-600 mt-1">
                Freelancers cannot see other users' offers or terms
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={form.hiddenBids || false}
                onChange={(e) => onChange("hiddenBids", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-900">Minimum Rating Required</p>
              <p className="text-sm text-gray-600 mt-1">
                Only workers with at least 4.5 stars can apply
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                checked={form.minRatingRequired || false}
                onChange={(e) => onChange("minRatingRequired", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </FormSection>

      {/* Communication */}
      <FormSection title="Communication">
        <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex-1">
            <p className="font-medium text-gray-900">Allow Pre-bid Messaging</p>
            <p className="text-sm text-gray-600 mt-1">
              Let workers ask clarifying questions before submitting a proposal
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input
              type="checkbox"
              checked={form.allowMessaging || true}
              onChange={(e) => onChange("allowMessaging", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </FormSection>
    </div>
  );
}
