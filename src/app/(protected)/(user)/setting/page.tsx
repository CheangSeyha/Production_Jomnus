// "use client";

// import { useEffect, useState, ChangeEvent } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import axios from "axios";

// import StatsManagement from "@/components/setting/StatsManagement";
// import Specializations from "@/components/setting/Specializations";
// import WorkHistory from "@/components/setting/WorkHistory";
// import ProfileHeader from "@/components/setting/ProfileHeader";

// import { useAuthStore } from "@/store/authStore";
// import { em } from "motion/react-client";


"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import StatsManagement from "@/components/setting/StatsManagement";
import Specializations from "@/components/setting/Specializations";
import WorkHistory from "@/components/setting/WorkHistory";
import ProfileHeader from "@/components/setting/ProfileHeader";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";

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

  // const {
  //   user,
  //   accessToken,
  // } = useAuthStore();
  
  // const updateUser = useAuthStore((state) => state.updateUser) || ((userData) => useAuthStore.setState({ user: userData }));
  // const setUser = useAuthStore((state) => state.setUser);
  
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
        const token = tokenFromUrl || localStorage.getItem("access_token");

        if (!token) {
          router.push("/auth/signin");
          return;
        }

        const res = await api.get("/users/me");

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
  <div className="h-full min-h-0 overflow-auto">
    <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-8">

      {/* Single Card */}
      <div className="rounded-2xl border border-sky-200 bg-white/90 shadow-[0_14px_40px_rgba(14,165,233,0.12)] backdrop-blur overflow-hidden">

        {/* Profile Header */}
        <div className="p-8 border-b border-sky-100">
          <ProfileHeader
            data={formData}
            onInputChange={handleInputChange}
            email={rawData?.email || user?.email}
            onSave={handleSave}
            isIdentityVerified={rawData?.isIdentityVerified}
          />
        </div>

        {/* Identity Verification */}
        <div className="p-8 border-b border-sky-100">
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
                <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-1">Verification</p>
                <h3 className="font-black text-xl text-slate-950 flex items-center gap-2">
                  Identity Verification Status
                  {rawData?.isIdentityVerified && (
                    <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-black tracking-wide">
                      VERIFIED
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  {rawData?.isIdentityVerified
                    ? "Your profile identity is fully verified."
                    : "Verify your profile to unlock trust badges across your listings."}
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
        </div>

        {/* Performance Stats */}
        <div className="p-8 border-b border-sky-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-1">Stats</p>
              <h3 className="font-black text-xl text-slate-950">Performance Statistics</h3>
            </div>
            <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${
              (rawData?.currentRole || rawData?.role) === "REQUESTER"
                ? "bg-orange-50 text-orange-600 border-orange-100"
                : "bg-sky-50 text-sky-600 border-sky-200"
            }`}>
              {rawData?.currentRole || rawData?.role} Mode
            </span>
          </div>
          <StatsManagement data={rawData} />
        </div>

        {/* Work History */}
        <div className="p-8 border-b border-sky-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-1">Portfolio</p>
              <h3 className="font-black text-xl text-slate-950">Work History & Portfolio</h3>
            </div>
            <button
              onClick={addNewProject}
              className="text-sky-600 hover:text-white bg-sky-50 hover:bg-sky-500 px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all flex items-center gap-2 border border-sky-200 hover:border-sky-500 shadow-sm"
            >
              <span className="text-lg leading-none">+</span> Add Case Study
            </button>
          </div>
          <WorkHistory data={projects} setData={setProjects} />
        </div>

        {/* Specializations */}
        {(rawData?.currentRole === "PERFORMER" || rawData?.role === "PERFORMER") && (
          <div className="p-8">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-1">Skills</p>
              <h3 className="font-black text-xl text-slate-950">Expertise & Skills</h3>
              <p className="text-xs text-slate-400 mt-1">These tags help you match with the right tasks.</p>
            </div>
            <Specializations data={rawData?.specializations || []} />
          </div>
        )}

      </div>
    </div>
  </div>
);

}