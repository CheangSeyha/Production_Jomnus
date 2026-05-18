"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import StatsManagement from "@/components/setting/StatsManagement";
import Specializations from "@/components/setting/Specializations";
import WorkHistory from "@/components/setting/WorkHistory";
import ProfileHeader from "@/components/setting/ProfileHeader";

import { useAuthStore } from "@/store/authStore";

type ProjectItem = {
  id: number;
  title: string;
  description: string;
  tag: string;
  image?: string;
};

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

  const { user } = useAuthStore();

  const setUser = useAuthStore((state) => state.setUser);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
        const token =
          tokenFromUrl || localStorage.getItem("access_token");

        if (!token) {
          router.push("/auth/signin");
          return;
        }

        const res = await axios.get(
          "http://localhost:3001/api/users/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data);
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
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

      setUser(res.data);

      setSaveSuccess(true);

      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error(
        "Save Error:",
        err.response?.data || err.message
      );

      alert("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  // -------------------------
  // PROJECTS
  // -------------------------
  const [projects, setProjects] = useState<ProjectItem[]>([
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
    const newProj: ProjectItem = {
      id: Date.now(),
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

        {/* PROFILE */}
        <ProfileHeader
          data={formData}
          onInputChange={handleInputChange}
          email={user.email}
        />

        {/* STATS */}
        <section className="bg-white p-8 rounded-3xl shadow-sm">
          <h3 className="text-xl font-bold">
            Performance Statistics
          </h3>

          <StatsManagement data={user} />
        </section>

        {/* WORK HISTORY */}
        <section className="bg-white p-8 rounded-3xl shadow-sm">
          <div className="flex justify-between mb-6">
            <h3 className="text-xl font-bold">
              Work History & Portfolio
            </h3>

            <button
              onClick={addNewProject}
              className="text-blue-600 font-bold"
            >
              + Add Case Study
            </button>
          </div>

          <WorkHistory
            data={projects}
            setData={setProjects}
          />
        </section>

        {/* SKILLS */}
        {(user?.currentRole || user?.role) === "PERFORMER" && (
          <section className="bg-white p-8 rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold">
              Expertise & Skills
            </h3>

            <Specializations data={user.specializations} />
          </section>
        )}
      </div>
    </div>
  );
}