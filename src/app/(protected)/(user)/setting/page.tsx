"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import StatsManagement from "@/components/setting/StatsManagement";
import Specializations from "@/components/setting/Specializations";
import WorkHistory from "@/components/setting/WorkHistory";
import ProfileHeader from "@/components/setting/ProfileHeader";
import { useUserStore } from "@/store/userStore";

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

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const token = tokenFromUrl || localStorage.getItem("access_token");
  //       const response = await axios.get("http://localhost:3001/api/users/me", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });

  //       const user = response.data;
  //       setRawData(user);

  //       setFormData({
  //         id: user.id,
  //         fullName: user.fullName || "",
  //         phone: user.phone || "",
  //         locationText: user.locationText || (user.city && user.country ? `${user.city}, ${user.country}` : user.city || user.country || ""),
  //         travelRadius: user.travelRadius || 0,
  //         bio: user.bio || "",
  //         profileImage: user.profileImage || user.picture || "",
  //       });
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchUserData();
  // }, []);

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const token = tokenFromUrl || localStorage.getItem("access_token");
      const response = await axios.get("http://localhost:3001/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = response.data;
      
      // SYNC THE STORE: This makes the Header show the data on page load
      setUser(user); 

      setRawData(user);
      setFormData({
        id: user.id,
        fullName: user.fullName || "",
        phone: user.phone || "",
        city: user.locationText || (user.city && user.country ? `${user.city}, ${user.country}` : user.city || user.country || ""),
        currentRole: user.currentRole || "",
        bio: user.bio || "",
        profileImage: user.profileImage || user.picture || "",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchUserData();
}, [setUser]); // Add setUser to dependencies

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

// const handleSave = async () => {
//   setIsSaving(true);
//   setSaveSuccess(false);

//   try {
//     const token = localStorage.getItem("access_token");

//     const payload: any = {
//       fullName: formData.fullName || undefined,
//       phone: formData.phone || undefined,
//       bio: formData.bio || undefined,
//       city: formData.city || undefined,
//       country: formData.country || undefined,

//       // IMPORTANT: only send valid URL
//       profileImage:
//         typeof formData.profileImage === "string" &&
//         formData.profileImage.startsWith("http")
//           ? formData.profileImage
//           : undefined,
//     };

//     await axios.patch(
//       "http://localhost:3001/api/users/me",
//       {
//         fullName: formData.fullName || "",
//         phone: formData.phone || "",
//         bio: formData.bio || "",
//         city: formData.city || "",
//         country: formData.country || "",
//         profileImage: formData.profileImage || "",
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     setSaveSuccess(true);
//     setTimeout(() => setSaveSuccess(false), 3000);

//   } catch (error: any) {
//     console.log("ERROR:", error?.response?.data);
//     alert(error?.response?.data?.message || "Failed to save changes.");
//   } finally {
//     setIsSaving(false);
//   }
// };

const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const token = localStorage.getItem("access_token");

      // This is the data you are sending to the backend
      const updatePayload = {
        fullName: formData.fullName || "",
        phone: formData.phone || "",
        bio: formData.bio || "",
        city: formData.city || "",
        country: formData.country || "",
        profileImage: formData.profileImage || "",
      };

      const response = await axios.patch(
        "http://localhost:3001/api/users/me",
        updatePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // --- THE MISSING PIECE ---
      // Update the Zustand store so the Header changes instantly!
      // If your backend returns the updated user, use response.data
      // Otherwise, use your local updatePayload
      updateUser(response.data || updatePayload); 
      // --------------------------

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (error: any) {
      console.log("ERROR:", error?.response?.data);
      alert(error?.response?.data?.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };


const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    "http://localhost:3001/api/users/upload-avatar",
    formData
  );

  setFormData((prev) => ({
    ...prev,
    profileImage: res.data.url, // store URL only
  }));
};

// Inside SettingPage function
const [projects, setProjects] = useState([
  {
    id: 1,
    title: "Luxury Penthouse Furniture Setup",
    description: "Full white-glove assembly for a 4-bedroom penthouse in the Marina District.",
    tag: "Relocation Logistics",
    image: "/images/jomnus.png"
  }
]);

const addNewProject = () => {
  const newProj = {
    id: Date.now(), // Unique ID
    title: "New Project Title",
    description: "Enter your project description here.",
    tag: "General",
    image: ""
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

        {/* Profile Details */}
        <ProfileHeader
          data={formData}
          onInputChange={handleInputChange}
          email={rawData?.email}
        />

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
              <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${
                rawData?.currentRole === "REQUESTER" 
                  ? "bg-orange-50 text-orange-600 border-orange-100" 
                  : "bg-blue-50 text-blue-600 border-blue-100"
              }`}>
                {rawData?.currentRole} Mode
              </span>
            </div>
          </div>
          <StatsManagement data={rawData} />
        </section>

        {/* Portfolio Section */}

          {/* Work History Section - Only visible/more prominent for Performers */}
        <section className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-xl text-slate-800">Work History & Portfolio</h3>
              <p className="text-xs text-slate-400 mt-1">Showcase your best completed tasks.</p>
            </div>
            {/* 3. ATTACH THE ADD FUNCTION HERE */}
            <button onClick={addNewProject} className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">
              + Add New Case Study
            </button>
          </div>
          {/* 4. PASS DATA AND SETTER TO COMPONENT */}
          <WorkHistory data={projects} setData={setProjects} />
        </section>


        {/* Only Performers need to showcase specific skills/specializations */}
        {rawData?.currentRole === "PERFORMER" && (
          <section className="animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-bold text-xl text-slate-800">Expertise & Skills</h3>
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