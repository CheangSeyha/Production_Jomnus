"use client";

import { useState, useRef } from "react";
import { Edit2, Trash2, Check, X, Camera, Plus } from "lucide-react";

interface WorkItem {
  id: number;
  title: string;
  description: string;
  tag: string;
  image?: string;
}

interface WorkHistoryProps {
  data: WorkItem[];
  setData: React.Dispatch<React.SetStateAction<WorkItem[]>>;
}

export default function WorkHistory({ data, setData }: WorkHistoryProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<WorkItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- IMAGE UPLOAD SIMULATION ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editForm) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- ACTIONS ---
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setData((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const startEditing = (item: WorkItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const saveEdit = () => {
    if (editForm) {
      setData((prev) => prev.map((item) => (item.id === editingId ? editForm : item)));
      setEditingId(null);
      setEditForm(null);
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
          <Plus className="w-6 h-6 text-slate-300" />
        </div>
        <p className="text-slate-500 font-medium">Your portfolio is empty</p>
        <p className="text-slate-400 text-xs mt-1">Add your first project to impress clients.</p>
      </div>
    );
  }

  return (
  <div className="space-y-4">
    {data.map((item) => (
      <div
        key={item.id}
        className="group flex flex-col md:flex-row bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-300"
      >
        {/* IMAGE SECTION */}
        <div className="relative md:w-1/4 h-62 md:h-auto bg-slate-100 overflow-hidden">
          <img
            src={
              item.image ||
              "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop"
            }
            className={`w-full h-full object-cover transition-transform duration-500 ${
              editingId === item.id ? "scale-110 blur-sm" : "group-hover:scale-105"
            }`}
          />

          {editingId === item.id ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-xl hover:bg-white transition-all"
              >
                <Camera className="w-4 h-4" /> Change Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          ) : (
            <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={() => startEditing(item)}
                className="p-2.5 bg-white/90 backdrop-blur rounded-xl shadow-lg text-slate-700 hover:text-blue-600 hover:bg-white"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2.5 bg-red-500/90 backdrop-blur rounded-xl shadow-lg text-white hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* CONTENT SECTION */}
        <div className="p-6 flex-1 flex flex-col justify-center">
          {editingId === item.id ? (
            <div className="space-y-4">
              <input
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-100"
                value={editForm?.title}
                onChange={(e) =>
                  setEditForm({ ...editForm!, title: e.target.value })
                }
                placeholder="What did you do?"
              />
              <textarea
                className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-xs text-slate-600 h-24 resize-none focus:ring-2 focus:ring-blue-100"
                value={editForm?.description}
                onChange={(e) =>
                  setEditForm({ ...editForm!, description: e.target.value })
                }
                placeholder="Describe the results..."
              />
              <div className="flex gap-3 mt-2">
                <button
                  onClick={saveEdit}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-blue-200"
                >
                  Done
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {item.tag}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                {item.title}
              </h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                {item.description}
              </p>
            </>
          )}
        </div>
      </div>
    ))}
  </div>
);

}