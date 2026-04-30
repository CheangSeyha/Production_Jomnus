// src/components/dashboard/setting/ProfileHeader.tsx

import { MapPin, Camera, Mail } from "lucide-react";
import { ChangeEvent, useRef } from "react";

interface ProfileHeaderProps {
  data: {
    fullName: string;
    phone: string;
    locationText: string;
    travelRadius: number;
    profileImage: string | null;
    bio: string;
  };
  email: string;
  onInputChange: (
    e: any // Changed to 'any' to support the custom file objects we create
  ) => void;
}

export default function ProfileHeader({
  data,
  email,
  onInputChange,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fallback for profile image
  const profileImageUrl = data.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName || "User")}`;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Create a local preview for the UI
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

      // 2. Pass the actual File object to the parent for the API upload
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
      {/* Hidden File Input */}
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
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {data.fullName || "Your Name"}
          </h2>
          <div className="flex items-center gap-2 text-sm text-slate-500 justify-center md:justify-start">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>{email}</span>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-md font-medium">
              Verified
            </span>
          </div>
          <button 
            type="button"
            onClick={handleImageClick}
            className="text-sm font-bold text-blue-600 hover:underline pt-1"
          >
            Change Profile Photo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Full Display Name
          </label>
          <input
            type="text"
            name="fullName"
            value={data.fullName}
            onChange={onInputChange}
            placeholder="e.g., Doeung Sreypy"
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all text-slate-800"
          />
        </div>

        {/* Phone */}
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

        {/* Location */}
        <div className="space-y-2 relative">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Primary Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="locationText"
              value={data.locationText || ""}
              onChange={onInputChange}
              placeholder="e.g., Phnom Penh, Cambodia"
              className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
            />
          </div>
        </div>

        {/* Travel Radius */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Travel Radius (km)
          </label>
          <input
            type="number"
            name="travelRadius"
            value={data.travelRadius}
            onChange={onInputChange}
            placeholder="e.g., 25"
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none"
          />
        </div>

        {/* Bio */}
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