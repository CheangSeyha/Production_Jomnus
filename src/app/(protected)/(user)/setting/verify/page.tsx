"use client";

import { useState, ChangeEvent, DragEvent } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function IdentityVerificationRequestPage() {
  const router = useRouter();
  
  // File States
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  
  // Preview States
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  
  // Drag Hover States
  const [isDragOverId, setIsDragOverId] = useState(false);
  const [isDragOverSelfie, setIsDragOverSelfie] = useState(false);

  // Lightbox Modal States for inspecting image files
  const [activeModalImage, setActiveModalImage] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core File Assignment Logic (Using browser-compliant file.type)
  const assignFile = (file: File, type: "id_card" | "selfie") => {
    if (!file.type.match(/\/(jpg|jpeg|png)$/)) {
      setError("Only JPG, JPEG, and PNG images are allowed.");
      return;
    }
    setError(null);
    const previewUrl = URL.createObjectURL(file);

    if (type === "id_card") {
      setIdCardFile(file);
      setIdCardPreview(previewUrl);
    } else {
      setSelfieFile(file);
      setSelfiePreview(previewUrl);
    }
  };

  // Input Field Change Handler
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: "id_card" | "selfie") => {
    if (!e.target.files || e.target.files.length === 0) return;
    assignFile(e.target.files[0], type);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>, type: "id_card" | "selfie") => {
    e.preventDefault();
    if (type === "id_card") setIsDragOverId(true);
    if (type === "selfie") setIsDragOverSelfie(true);
  };

  const handleDragLeave = (type: "id_card" | "selfie") => {
    if (type === "id_card") setIsDragOverId(false);
    if (type === "selfie") setIsDragOverSelfie(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, type: "id_card" | "selfie") => {
    e.preventDefault();
    if (type === "id_card") setIsDragOverId(false);
    if (type === "selfie") setIsDragOverSelfie(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      assignFile(e.dataTransfer.files[0], type);
    }
  };

  // Removal UI Actions
  const handleRemoveFile = (type: "id_card" | "selfie") => {
    if (type === "id_card") {
      if (idCardPreview) URL.revokeObjectURL(idCardPreview);
      setIdCardFile(null);
      setIdCardPreview(null);
    } else {
      if (selfiePreview) URL.revokeObjectURL(selfiePreview);
      setSelfieFile(null);
      setSelfiePreview(null);
    }
  };

  const handleSubmit = async () => {
    if (!idCardFile || !selfieFile) {
      setError("Please upload both an ID Card image and a verification Selfie to proceed.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("id_card", idCardFile);
      formData.append("selfie", selfieFile);

      await api.post("/identity-verifications", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Verification requested successfully! Admins are reviewing your data.");
      router.push("/setting");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Something went wrong while submitting verification images.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 relative">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation back Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Request Verified Identity Status
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Provide your required document images below to submit a verification request.
            </p>
          </div>
          <button
            onClick={() => router.push("/setting")}
            className="text-slate-500 hover:text-slate-700 font-bold text-sm transition-colors bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl"
          >
            Back to Settings
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* 1. ID CARD FIELD WITH DRAG/DROP, REMOVE & INSPECT CLICK UI */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-slate-800">1. ID Card / Passport Document</h3>
              <p className="text-xs text-slate-400 mt-1">Upload a clear, high-resolution photo of your government-issued identity document.</p>
            </div>
            
            <div
              onDragOver={(e) => handleDragOver(e, "id_card")}
              onDragLeave={() => handleDragLeave("id_card")}
              onDrop={(e) => handleDrop(e, "id_card")}
              className={`relative aspect-[3/2] w-full rounded-xl overflow-hidden flex flex-col items-center justify-center border transition-all ${
                idCardPreview 
                  ? "bg-slate-100 border-slate-200 group cursor-pointer" 
                  : isDragOverId 
                    ? "bg-blue-50 border-blue-500 border-2 scale-[1.02]" 
                    : "bg-slate-50 border-dashed border-slate-200"
              }`}
            >
              {idCardPreview ? (
                <>
                  <img 
                    src={idCardPreview} 
                    alt="ID Card Preview" 
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" 
                    onClick={() => setActiveModalImage(idCardPreview)}
                  />
                  {/* Inspect Overlay Prompt */}
                  <div 
                    onClick={() => setActiveModalImage(idCardPreview)}
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none"
                  >
                    <span className="bg-white/90 backdrop-blur text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.601z" />
                      </svg>
                      Click to Inspect
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile("id_card");
                    }}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-colors z-10"
                    title="Remove Image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              ) : (
                <div className="text-center p-4 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-slate-400 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  <p className="text-slate-500 text-xs font-semibold">Drag and drop document here</p>
                  <p className="text-slate-400 text-[10px] mt-1">Supports PNG, JPG, JPEG</p>
                </div>
              )}
            </div>

            {!idCardFile ? (
              <label className="block w-full text-center bg-slate-50 hover:bg-slate-100 border border-slate-200 py-3 rounded-xl cursor-pointer font-bold text-xs text-slate-600 transition-colors shadow-sm">
                Choose ID Card File
                <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={(e) => handleFileChange(e, "id_card")} className="hidden" />
              </label>
            ) : (
              <div className="text-center text-xs text-green-600 font-bold bg-green-50 py-3 rounded-xl border border-green-100 flex items-center justify-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/xl" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                ID Card File Loaded
              </div>
            )}
          </div>

          {/* 2. SELFIE MATCH FIELD WITH DRAG/DROP, REMOVE & INSPECT CLICK UI */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-slate-800">2. Real-Time Matching Selfie</h3>
              <p className="text-xs text-slate-400 mt-1">Upload a clear, forward-facing profile portrait photo to complete identification verification.</p>
            </div>

            <div
              onDragOver={(e) => handleDragOver(e, "selfie")}
              onDragLeave={() => handleDragLeave("selfie")}
              onDrop={(e) => handleDrop(e, "selfie")}
              className={`relative aspect-[3/2] w-full rounded-xl overflow-hidden flex flex-col items-center justify-center border transition-all ${
                selfiePreview 
                  ? "bg-slate-100 border-slate-200 group cursor-pointer" 
                  : isDragOverSelfie 
                    ? "bg-blue-50 border-blue-500 border-2 scale-[1.02]" 
                    : "bg-slate-50 border-dashed border-slate-200"
              }`}
            >
              {selfiePreview ? (
                <>
                  <img 
                    src={selfiePreview} 
                    alt="Selfie Preview" 
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" 
                    onClick={() => setActiveModalImage(selfiePreview)}
                  />
                  {/* Inspect Overlay Prompt */}
                  <div 
                    onClick={() => setActiveModalImage(selfiePreview)}
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none"
                  >
                    <span className="bg-white/90 backdrop-blur text-slate-800 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.603 10.601z" />
                      </svg>
                      Click to Inspect
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile("selfie");
                    }}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-colors z-10"
                    title="Remove Image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              ) : (
                <div className="text-center p-4 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 mx-auto text-slate-400 mb-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  <p className="text-slate-500 text-xs font-semibold">Drag and drop selfie here</p>
                  <p className="text-slate-400 text-[10px] mt-1">Supports PNG, JPG, JPEG</p>
                </div>
              )}
            </div>

            {!selfieFile ? (
              <label className="block w-full text-center bg-slate-50 hover:bg-slate-100 border border-slate-200 py-3 rounded-xl cursor-pointer font-bold text-xs text-slate-600 transition-colors shadow-sm">
                Choose Selfie File
                <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={(e) => handleFileChange(e, "selfie")} className="hidden" />
              </label>
            ) : (
              <div className="text-center text-xs text-green-600 font-bold bg-green-50 py-3 rounded-xl border border-green-100 flex items-center justify-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Selfie File Loaded
              </div>
            )}
          </div>

        </div>

        {/* Action Bottom Submit Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={submitting || !idCardFile || !selfieFile}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold px-10 py-3.5 rounded-xl text-sm tracking-tight shadow-md transition-all"
          >
            {submitting ? "Uploading Documents..." : "Submit Verification Setup"}
          </button>
        </div>

      </div>

      {/* FULL-SCREEN LIGHTBOX OVERLAY MODAL */}
      {activeModalImage && (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-200"
          onClick={() => setActiveModalImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute -top-12 right-0 md:-top-4 md:-right-12 bg-white text-slate-800 hover:bg-slate-100 p-2.5 rounded-full shadow-xl transition-all"
              title="Close Inspection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={activeModalImage} 
              alt="Inspection View" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}