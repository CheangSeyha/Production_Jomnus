"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import StatsManagement from "@/components/setting/StatsManagement";
import Specializations from "@/components/setting/Specializations";
import WorkHistory from "@/components/setting/WorkHistory";
import ProfileHeader from "@/components/setting/ProfileHeader";
import { useAuthStore } from "@/store/authStore";

// Match the WorkItem interface exactly as expected by WorkHistory component
// The WorkHistory component expects id to be number, not string | number
interface WorkItem {
  id: number;  // Changed from number | string to number
  title: string;
  description: string;
  tag: string;
  image?: string;
}

type FormDataType = {
  id: number | null;
  fullName: string;
  phone: string;
  city: string;
  currentRole: string;
  bio: string;
  profileImage: string;
};

export default function SettingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, setUser } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [rawData, setRawData] = useState<any>(null);

  const [formData, setFormData] = useState<FormDataType>({
    id: null,
    fullName: "",
    phone: "",
    city: "",
    currentRole: "",
    bio: "",
    profileImage: "",
  });

  const tokenFromUrl = searchParams.get("token");

  // -------------------------
  // INIT FORM FROM STORE USER
  // -------------------------
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || null,
        fullName: user.fullName || "",
        phone: user.phone || "",
        city: user.city || "",
        currentRole: user.currentRole || user.role || "",
        bio: user.bio || "",
        profileImage: user.profileImage || "",
      });
      setRawData(user);
      setLoading(false);
    }
  }, [user]);

  // -------------------------
  // OPTIONAL: fallback fetch
  // -------------------------
  useEffect(() => {
    const fetchUser = async () => {
      if (user) return;

      try {
        const token = tokenFromUrl || localStorage.getItem("access_token");

        if (!token) {
          router.push("/auth/signin");
          return;
        }

        const res = await axios.get("http://localhost:3001/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedUser = res.data;

        // NORMALIZE: Ensure frontend always safely tracks identity status across case types
        const normalizedUser = {
          ...fetchedUser,
          isIdentityVerified:
            fetchedUser.isIdentityVerified ??
            fetchedUser.is_identity_verified ??
            false,
        };

        setUser(normalizedUser);
        setRawData(normalizedUser);
        setFormData({
          id: normalizedUser.id || null,
          fullName: normalizedUser.fullName || "",
          phone: normalizedUser.phone || "",
          city:
            normalizedUser.locationText ||
            (normalizedUser.city && normalizedUser.country
              ? `${normalizedUser.city}, ${normalizedUser.country}`
              : normalizedUser.city || normalizedUser.country || ""),
          currentRole: normalizedUser.currentRole || normalizedUser.role || "",
          bio: normalizedUser.bio || "",
          profileImage: normalizedUser.profileImage || normalizedUser.picture || "",
        });
      } catch (err: any) {
        console.error(
          "Failed to fetch user:",
          err?.response?.data || err.message || err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user, tokenFromUrl, router, setUser]);

  // -------------------------
  // INPUT CHANGE
  // -------------------------
  // Fix: Properly type the onChange handler to match ProfileHeader's expected type
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -------------------------
  // SAVE PROFILE
  // -------------------------
  const handleSave = async () => {
    setIsSaving(true);

    try {
      const token = localStorage.getItem("access_token");

      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        bio: formData.bio,
        city: formData.city,
        profileImage: formData.profileImage,
      };

      const res = await axios.patch(
        "http://localhost:3001/api/users/me",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the user in store with the response
      setUser(res.data);
      setRawData(res.data);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error(
        "Save Error:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // -------------------------
  // PROJECTS
  // -------------------------
  // Fix: Use number for id, not Date.now() which returns number but ensure it's within number range
  const [projects, setProjects] = useState<WorkItem[]>([
    {
      id: 1,
      title: "Luxury Penthouse Furniture Setup",
      description:
        "Full white-glove assembly for a 4-bedroom penthouse.",
      tag: "Relocation Logistics",
      image: "/images/jomnus.png",
    },
  ]);

  const addNewProject = () => {
    const newProj: WorkItem = {
      id: Date.now(), // Date.now() returns number, which is fine
      title: "New Project Title",
      description: "Enter description",
      tag: "General",
      image: "",
    };

    setProjects((prev) => [newProj, ...prev]);
  };

  // -------------------------
  // LOADING STATE
  // -------------------------
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 text-slate-400 font-medium">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-6 bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-3xl font-black text-slate-800">
              Profile Settings
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Update your information below
            </p>
          </div>

          <div className="flex gap-4 items-center">
            {saveSuccess && (
              <span className="text-green-600 text-xs font-bold">
                Saved!
              </span>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Profile Details Header Component */}
        <ProfileHeader
          data={formData}
          onInputChange={handleInputChange}
          email={rawData?.email || user?.email}
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
                {(rawData?.currentRole || rawData?.role) === "REQUESTER"
                  ? "Viewing your activity as a task requester."
                  : "Viewing your activity as a task performer."}
              </p>
            </div>
            <div className="flex gap-2">
              <span
                className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${
                  (rawData?.currentRole || rawData?.role) === "REQUESTER"
                    ? "bg-orange-50 text-orange-600 border-orange-100"
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}
              >
                {rawData?.currentRole || rawData?.role} Mode
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
              className="text-blue-600 font-bold"
            >
              + Add Case Study
            </button>
          </div>
          <WorkHistory data={projects} setData={setProjects} />
        </section>

        {/* Specializations Skill Tags Section */}
        {(rawData?.currentRole === "PERFORMER" || rawData?.role === "PERFORMER") && (
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
              <Specializations data={rawData?.specializations || []} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}