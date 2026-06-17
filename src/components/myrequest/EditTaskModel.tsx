"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Save,
  Trash2,
  MapPin,
} from "lucide-react";

import TaskDetailsForm from "./TaskDetailsForm";
import ScheduleForm from "./ScheduleForm";
import BudgetForm from "./BudgetForm";

type Props = {
  form: any;

  setForm: (value: any) => void;

  onClose: () => void;

  onSave: () => void;

  onDelete?: () => void;

  saving?: boolean;
  onFormChange?: (name: string, value: any) => void;
};

export default function EditTaskModal({
  form,
  setForm,
  onClose,
  onSave,
  onDelete,
  saving,
  onFormChange,
}: Props) {
  const handleChange = (
    name: string,
    value: any,
  ) => {
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
    if (onFormChange) onFormChange(name, value);
  };

  return (
    <div className="fixed inset-0 z-[1000] overflow-y-auto bg-slate-950/60 backdrop-blur-md">

      <div className="mx-auto max-w-7xl px-4 py-10">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* LEFT */}
          <div className="space-y-5">

            {/* HEADER */}
            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-sky-200">
                  Task Workspace
                </p>

                <h1 className="mt-2 text-4xl font-black tracking-tight text-white">
                  Edit Task
                </h1>

                <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-300">
                  Update task information, pricing, workers,
                  schedule, and location settings.
                </p>
              </div>

              <button
                onClick={onClose}
                className="
                  inline-flex h-11 items-center gap-2
                  rounded-2xl border border-white/20
                  bg-white/10 px-5
                  text-sm font-bold text-white
                  transition hover:bg-white/20
                "
              >
                <ArrowLeft size={16} />
                Close
              </button>
            </div>

            {/* FORMS */}
            <TaskDetailsForm
              form={form}
              onChange={handleChange}
            />

            <ScheduleForm
              form={form}
              onChange={handleChange}
            />

            <BudgetForm
              form={form}
              onChange={handleChange}
            />

            {/* SAVE BAR */}
            <div className="sticky bottom-4 z-30">

              <div
                className="
                  flex flex-col gap-4
                  rounded-3xl border border-sky-100
                  bg-white/95 p-5
                  shadow-[0_24px_70px_rgba(15,23,42,0.28)] backdrop-blur
                  sm:flex-row sm:items-center sm:justify-between
                "
              >

                <div>
                  <p className="text-sm font-bold text-slate-950">
                    Ready to update this task?
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Changes instantly affect marketplace visibility.
                  </p>
                </div>

                <div className="flex items-center gap-3">

                  <button
                    onClick={onClose}
                    className="
                      h-11 rounded-2xl
                      border border-slate-200
                      bg-white px-5
                      text-sm font-bold text-slate-700
                      transition hover:bg-slate-100
                    "
                  >
                    Cancel
                  </button>

                  <button
                    disabled={saving}
                    onClick={onSave}
                    className="
                      inline-flex h-11 items-center gap-2
                      rounded-2xl bg-sky-600
                      px-6 text-sm font-bold text-white
                      shadow-lg shadow-sky-500/30
                      transition hover:-translate-y-0.5 hover:bg-cyan-500
                      disabled:cursor-not-allowed disabled:opacity-60
                    "
                  >
                    <Save size={16} />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <aside>

            <div className="space-y-4 lg:sticky lg:top-8">

              {/* LIVE PREVIEW */}
              <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white p-5 shadow-[0_18px_45px_rgba(14,165,233,0.14)]">

                <p className="text-xs font-black uppercase tracking-widest text-sky-600">
                  Preview
                </p>
                <h3 className="mt-1 text-base font-black text-slate-950">
                  Live Preview
                </h3>

                <div className="mt-5 space-y-4">

                  <div>
                    <p className="text-2xl font-black leading-tight text-slate-950">
                      {form.title || "Task title"}
                    </p>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {form.description ||
                        "Task description preview"}
                    </p>
                  </div>

                  {/* PRICE */}
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

                    <p className="text-xs font-black uppercase tracking-wide text-emerald-600">
                      Budget
                    </p>

                    <p className="mt-2 text-3xl font-black text-emerald-700">
                      $
                      {Number(
                        form.price || 0,
                      ).toFixed(2)}
                    </p>
                  </div>

                  {/* WORKERS */}
                  <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">

                    <p className="text-xs font-black uppercase tracking-wide text-indigo-600">
                      Workers Needed
                    </p>

                    <p className="mt-2 text-2xl font-black text-indigo-700">
                      {form.requiredWorkers || 1}
                    </p>

                  </div>

                  {/* LOCATION */}
                  <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4">

                    <div className="flex items-center gap-2">

                      <MapPin
                        size={15}
                        className="text-sky-600"
                      />

                      <p className="text-xs font-black uppercase tracking-wide text-sky-600">
                        Location
                      </p>
                    </div>

                    <p className="mt-3 text-sm font-bold leading-6 text-slate-800">

                      {form.locationText ||
                        "Location selected from map"}

                    </p>

                    {form.latitude && (
                      <p className="mt-2 text-xs font-semibold text-slate-500">
                        {form.latitude.toFixed(5)},
                        {" "}
                        {form.longitude.toFixed(5)}
                      </p>
                    )}
                  </div>

                  {/* DEADLINE */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">

                    <p className="text-xs font-black uppercase tracking-wide text-slate-400">
                      Deadline
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-900">

                      {form.deadline
                        ? new Date(form.deadline).toLocaleString()
                        : "No deadline"}

                    </p>

                  </div>

                </div>
              </div>

              {/* TIPS */}
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">

                <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                  <CheckCircle2 size={16} />
                  Smart Editing Tips
                </h4>

                <ul className="mt-4 space-y-3 text-sm leading-6 text-emerald-800">

                  <li>
                    Increasing workers can reopen visibility.
                  </li>

                  <li>
                    Better locations improve worker trust.
                  </li>

                  <li>
                    Higher budgets attract faster responses.
                  </li>

                </ul>
              </div>

              {/* DANGER ZONE */}
              <div className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">

                <h4 className="text-sm font-bold uppercase tracking-wide text-red-700">
                  Danger Zone
                </h4>

                <p className="mt-3 text-sm leading-7 text-red-600">
                  Deleting a task permanently removes
                  applications, assignments, and task history.
                </p>

                <button
                  onClick={onDelete}
                  className="
                    mt-5 inline-flex items-center gap-2
                    rounded-2xl bg-red-600
                    px-5 py-3
                    text-sm font-bold text-white
                    transition hover:bg-red-700
                  "
                >
                  <Trash2 size={15} />
                  Delete Task
                </button>

              </div>

            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
