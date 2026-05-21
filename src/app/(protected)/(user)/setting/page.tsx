"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StatsManagement from "@/components/setting/StatsManagement";
import Specializations from "@/components/setting/Specializations";
import WorkHistory from "@/components/setting/WorkHistory";
import ProfileHeader from "@/components/setting/ProfileHeader";
import { useUserStore } from "@/store/userStore";
import api from "@/lib/axios";

interface WorkItem {
  id: number | string;
  title: string;
  description: string;
  tag: string;
  image?: string;
}

export default function SettingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, updateUser } = useUserStore();

  const [formData, setFormData] = useState<any>({
    id: null,
    fullName: "",
    phone: "",
    city: "",
    currentRole: "",
    bio: "",
    profileImage: null,
  });

  const [rawData, setRawData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const tokenFromUrl = searchParams.get("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (tokenFromUrl) {
          localStorage.setItem("access_token", tokenFromUrl);
        }

        const response = await api.get("/users/me");
        const user = response.data;

        // NORMALIZE: Ensure frontend always safely tracks identity status across case types
        const normalizedUser = {
          ...user,
          isIdentityVerified: user.isIdentityVerified ?? user.is_identity_verified ?? false
        };

        setUser(normalizedUser);
        setRawData(normalizedUser);
        setFormData({
          id: normalizedUser.id,
          fullName: normalizedUser.fullName || "",
          phone: normalizedUser.phone || "",
          city:
            normalizedUser.locationText ||
            (normalizedUser.city && normalizedUser.country
              ? `${normalizedUser.city}, ${normalizedUser.country}`
              : normalizedUser.city || normalizedUser.country || ""),
          currentRole: normalizedUser.currentRole || "",
          bio: normalizedUser.bio || "",
          profileImage: normalizedUser.profileImage || normalizedUser.picture || "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [setUser, tokenFromUrl]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const updatePayload = {
        fullName: formData.fullName || "",
        phone: formData.phone || "",
        bio: formData.bio || "",
        city: formData.city || "",
        profileImage: formData.profileImage || "",
      };

      const response = await api.patch("/users/me", updatePayload);

      // Gracefully merge updated response payload back to your Normalized state schema
      const updatedUser = response.data || updatePayload;
      const normalizedUpdate = {
        ...updatedUser,
        isIdentityVerified: updatedUser.isIdentityVerified ?? updatedUser.is_identity_verified ?? rawData?.isIdentityVerified
      };

      updateUser(normalizedUpdate);
      setRawData((prev: any) => ({ ...prev, ...normalizedUpdate }));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error: any) {
      console.log("ERROR details:", error?.response?.data);
      alert(error?.response?.data?.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadProfileImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post("/users/upload-avatar", formData);

    setFormData((prev: any) => ({
      ...prev,
      profileImage: res.data.url,
    }));
  };

  const [projects, setProjects] = useState<WorkItem[]>([
    {
      id: 1,
      title: "Luxury Penthouse Furniture Setup",
      description:
        "Full white-glove assembly for a 4-bedroom penthouse in the Marina District.",
      tag: "Relocation Logistics",
      image: "/images/jomnus.png",
    },
  ]);

  const addNewProject = () => {
    const newProj = {
      id: Date.now(),
      title: "New Project Title",
      description: "Enter your project description here.",
      tag: "General",
      image: "",
    };
    setProjects([newProj, ...projects]);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 text-slate-400 font-medium">
        Authenticating...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
        {/* Title & Save Bar */}
        <div className="flex justify-between items-center border-b pb-6 bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter">
              Profile Settings
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              You are logged in successfully. Update your information below.
            </p>
          </div>
          <div className="flex gap-4 items-center">
            {saveSuccess && (
              <span className="text-xs text-green-600 font-bold uppercase tracking-widest animate-pulse">
                Changes saved!
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Profile Details Header Component */}
        <ProfileHeader
          data={formData}
          onInputChange={handleInputChange}
          email={rawData?.email}
          isIdentityVerified={rawData?.isIdentityVerified}
        />

        {/* IDENTITY VERIFICATION BOX */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-4 rounded-2xl ${rawData?.isIdentityVerified ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                {rawData?.isIdentityVerified ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                  Identity Verification Status
                  {rawData?.isIdentityVerified && (
                    <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-black tracking-wide">
                      VERIFIED
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {rawData?.isIdentityVerified 
                    ? "Your profile identity is fully verified. Your account exhibits trust badges across your listings." 
                    : "Verify your profile by providing identification credentials to unlock reliable task matching parameters and platform trust markers."}
                </p>
              </div>
            </div>
            
            {!rawData?.isIdentityVerified && (
              <button
                onClick={() => router.push("/setting/verify")}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shrink-0"
              >
                Verify Profile
              </button>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-xl text-slate-800">
                Performance Statistics
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {rawData?.currentRole === "REQUESTER"
                  ? "Viewing your activity as a task requester."
                  : "Viewing your activity as a task performer."}
              </p>
            </div>
            <div className="flex gap-2">
              <span
                className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${
                  rawData?.currentRole === "REQUESTER"
                    ? "bg-orange-50 text-orange-600 border-orange-100"
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}
              >
                {rawData?.currentRole} Mode
              </span>
            </div>
          </div>
          <StatsManagement data={rawData} />
        </section>

        {/* Work History Section */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-xl text-slate-800">
                Work History & Portfolio
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Showcase your best completed tasks.
              </p>
            </div>
            <button
              onClick={addNewProject}
              className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              + Add New Case Study
            </button>
          </div>
          <WorkHistory data={projects} setData={setProjects} />
        </section>

        {/* Specializations Skill Tags Section */}
        {rawData?.currentRole === "PERFORMER" && (
          <section className="animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-xl text-slate-800">
                    Expertise & Skills
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    These tags help you match with the right tasks.
                  </p>
                </div>
              </div>
              <Specializations data={rawData?.specializations} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}