"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/axios";

import StatsManagement from "@/components/setting/StatsManagement";
import Specializations from "@/components/setting/Specializations";
import WorkHistory from "@/components/setting/WorkHistory";
import ProfileHeader from "@/components/setting/ProfileHeader";

import { useAuthStore } from "@/store/authStore";

export default function SettingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    user,
    accessToken,
  } = useAuthStore();
  
  // const updateUser = useAuthStore((state) => state.updateUser) || ((userData) => useAuthStore.setState({ user: userData }));
  const setUser = useAuthStore((state) => state.setUser);
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [rawData, setRawData] = useState<any>(null);

  const [formData, setFormData] = useState ({
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
        currentRole: user.currentRole || "",
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
      const token = localStorage.getItem("access_token");

      if (!token) {
        router.push("/auth/signin");
        return;
      }

      const res = await api.get("/users/me");

      const fetchedUser = res.data;

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
        city: normalizedUser.city || "",
        currentRole: normalizedUser.currentRole || "",
        bio: normalizedUser.bio || "",
        profileImage: normalizedUser.profileImage || "",
      });
    } catch (err: any) {
      console.error("Failed to fetch user:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        router.push("/auth/signin");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, [user, router, setUser]);

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
      // const token = localStorage.getItem("access_token");

      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        bio: formData.bio,
        city: formData.city,
        profileImage: formData.profileImage,
      };

      const res = await api.patch("/users/me", payload);

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
  const [projects, setProjects] = useState ([
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
    const newProj: any= {
      id: Date.now(),
      title: "New Project Title",
      description: "Enter description",
      tag: "General",
      image: "",
    };

    setProjects((prev) => [newProj, ...prev]);
  };

  // -------------------------
  // LOADING
  // -------------------------
  if (loading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 text-slate-400 font-medium">
        Loading profile...
      </div>
    );
  }

return (
  <div className="min-h-screen from-slate-50 to-slate-100 text-slate-800 antialiased">
    <div className="max-w-7xl mx-auto p-8 lg:p-12 bg-white rounded-3xl shadow-sm border border-slate-200 space-y-12">

      {/* Profile Header */}
      <div>
        <ProfileHeader
          data={formData}
          email={user.email}
          onInputChange={handleInputChange}
          onSave={handleSave}
          isIdentityVerified={rawData?.isIdentityVerified}
        />
      </div>

      {/* IDENTITY VERIFICATION BOX (ADDED HERE 👇) */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <div className="flex items-start gap-4">

            <div className={`p-4 rounded-2xl ${
              rawData?.isIdentityVerified
                ? "bg-green-50 text-green-600"
                : "bg-amber-50 text-amber-600"
            }`}>

              {rawData?.isIdentityVerified ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" strokeWidth={2.5}
                  stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" strokeWidth={2}
                  stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
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

      {/* Performance Stats */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Performance Statistics
        </h2>
        <StatsManagement data={user} />
      </div>

      {/* Work History */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Work History & Portfolio
          </h2>
          <button
            onClick={addNewProject}
            className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-all"
          >
            + Add Case Study
          </button>
        </div>

        <WorkHistory data={projects} setData={setProjects} />
      </div>

      {/* Skills */}
      {user?.currentRole === "PERFORMER" && (
        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            Expertise & Skills
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            Core proficiencies matched with active requirements
          </p>

          <Specializations data={user.specializations} />
        </div>
      )}

    </div>
  </div>
);



}