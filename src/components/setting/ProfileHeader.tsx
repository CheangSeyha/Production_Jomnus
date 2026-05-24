// src/components/dashboard/setting/ProfileHeader.tsx

import { MapPin, Camera, Mail } from "lucide-react";
import { ChangeEvent, useRef } from "react";

interface ProfileHeaderProps {
  data: {
    fullName: string;
    phone: string;
    city: string;
    currentRole: string;
    profileImage: string | null;
    bio: string;
  };
  email: string;
  isIdentityVerified?: boolean;
  onInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
  ) => void;
}

export default function ProfileHeader({
  data,
  email,
  isIdentityVerified = false, 
  onInputChange,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileImageUrl = data.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName || "User")}`;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onInputChange({
          target: { 
            name: "profileImage", 
            value: event.target?.result 
          },
        });
      };
      reader.readAsDataURL(file);

      onInputChange({
        target: { 
          name: "imageFile", 
          value: file 
        },
      });
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-10">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex flex-col md:flex-row gap-8 items-center border-b pb-8 border-slate-100">
        <div 
          className="relative group cursor-pointer" 
          onClick={handleImageClick}
        >
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName || "User")}`;
              }}
            />
          </div>
          
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left">
          {/* BADGE RELOCATED: Placed immediately next to name string element inside a flex container */}
          <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {data.fullName || "Your Name"}
            </h2>
            {isIdentityVerified && (
              <span className="inline-flex items-center text-blue-500 shrink-0" title="Identity Verified">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-5 h-5 min-w-[20px] min-h-[20px] animate-in zoom-in duration-300"
                >
                  <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 014.254 2.226 4.49 4.49 0 01-.093 4.793 4.49 4.49 0 012.226 4.254 4.49 4.49 0 01-1.549 3.397 4.49 4.49 0 01-2.226 4.254 4.49 4.49 0 01-4.793-.093 4.49 4.49 0 01-4.254 2.226 4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-4.254-2.226 4.49 4.49 0 01.093-4.793 4.49 4.49 0 01-2.226-4.254 4.49 4.49 0 011.549-3.397 4.49 4.49 0 012.226-4.254zm5.418 7.301a.75.75 0 00-1.06-1.06l-3.5 3.5-1.5-1.5a.75.75 0 10-1.06 1.06l2 2a.75.75 0 001.06 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-500 justify-center md:justify-start">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="truncate max-w-[200px] sm:max-w-none">{email}</span>
          </div>
          
          <button 
            type="button"
            onClick={handleImageClick}
            className="text-sm font-bold text-blue-600 hover:underline pt-1 block mx-auto md:mx-0"
          >
            Change Profile Photo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Full Display Name
          </label>
          <input
            type="text"
            name="fullName"
            value={data.fullName}
            onChange={onInputChange}
            placeholder="e.g., Full Name"
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all text-slate-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Phone Number (Optional)
          </label>
          <input
            type="text"
            name="phone"
            value={data.phone}
            onChange={onInputChange}
            placeholder="e.g., +855..."
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all text-slate-800"
          />
        </div>

        <div className="space-y-2 relative">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Primary Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="city"
              value={data.city || ""}
              onChange={onInputChange}
              placeholder="e.g., Phnom Penh, Cambodia"
              className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Current Role
          </label>
          <input
            type="text"
            name="currentRole"
            value={data.currentRole}
            onChange={onInputChange}
            placeholder="e.g., Requester, Performer, UI/UX Designer"
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            About / Bio
          </label>
          <textarea
            name="bio"
            value={data.bio}
            onChange={onInputChange}
            placeholder="Tell requesters about your skills..."
            rows={5}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}