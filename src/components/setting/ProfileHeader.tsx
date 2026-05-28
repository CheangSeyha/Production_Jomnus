
"use client";

import { MapPin, Camera, Mail, Edit2, Check, X, CheckCircle2 } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

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
  onSave?: () => void;
}

export default function ProfileHeader({
  data,
  email,
  isIdentityVerified = false, 
  onInputChange,
  onSave,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const profileImageUrl = data.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName || "User")}`;

  const handleImageClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onInputChange({
          target: { name: "profileImage", value: event.target?.result },
        });
      };
      reader.readAsDataURL(file);

      onInputChange({
        target: { name: "imageFile", value: file },
      });
    }
  };

  return (
  <div className="bg-white p-10 rounded-3xl space-y-12">
    
    {/* Hidden File Input */}
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileChange}
      accept="image/*"
      className="hidden"
    />

    {/* Header */}
    <div className="flex items-center justify-between border-b pb-6 border-slate-100">
      <h2 className="text-xl font-bold text-slate-900">
        Profile Information
      </h2>

      {isEditing ? (
        <div className="flex gap-3">
          <button
            onClick={() => {
              onSave?.();
              setIsEditing(false);
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600"
          >
            <Check className="w-4 h-4" /> Save
          </button>

          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-300"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
        >
          <Edit2 className="w-4 h-4" /> Edit
        </button>
      )}
    </div>

    {/* Top Profile Section */}
    <div className="flex flex-col md:flex-row gap-10 items-center border-b pb-10 border-slate-100">
      
      {/* Avatar */}
      <div
        className={`relative group ${isEditing ? "cursor-pointer" : ""}`}
        onClick={handleImageClick}
      >
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100">
          <img
            src={profileImageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  data.fullName || "User"
                )}`;
            }}
          />
        </div>

        {isEditing && (
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/60 to-transparent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-7 h-7 text-white" />
          </div>
        )}
      </div>

      {/* Name + Email */}
      <div className="flex-1 space-y-3 text-center md:text-left">

        {/* Name + Verified badge */}
        <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
          {isEditing ? (
            <input
              type="text"
              name="fullName"
              value={data.fullName}
              onChange={onInputChange}
              className="text-3xl font-extrabold text-slate-900 w-full md:w-auto border-b border-slate-200 focus:border-blue-400 outline-none"
            />
          ) : (
            <h2 className="text-3xl font-extrabold text-slate-900">
              {data.fullName || "Your Name"}
            </h2>
          )}

          {isIdentityVerified && (
            <span className="text-green-500" title="Verified">
              <CheckCircle2 className="w-5 h-5" />
            </span>
          )}
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 text-sm text-slate-500 justify-center md:justify-start">
          <Mail className="w-4 h-4 text-slate-400" />
          <span>{email}</span>
        </div>

        {/* Change photo */}
        {isEditing && (
          <button
            type="button"
            onClick={handleImageClick}
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            Change Photo
          </button>
        )}
      </div>
    </div>

    {/* Fields Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
      {["fullName", "phone", "city", "currentRole", "bio"].map((field) => (
        <div
          key={field}
          className={`space-y-2 ${
            field === "bio" ? "md:col-span-2" : ""
          }`}
        >
          <label className="text-xs font-bold text-blue-500 uppercase tracking-wider">  
            {field === "fullName"
              ? "Full Display Name"
              : field === "phone"
              ? "Phone Number"
              : field === "city"
              ? "Primary Location"
              : field === "currentRole"
              ? "Current Role"
              : "About / Bio"}
          </label>

          {field === "bio" ? (
            isEditing ? (
              <textarea
                name="bio"
                value={data.bio}
                onChange={onInputChange}
                rows={5}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-200 outline-none"
              />
            ) : (
              <p className="text-slate-700">{data.bio}</p>
            )
          ) : isEditing ? (
            <input
              type="text"
              name={field}
              value={(data as any)[field]}
              onChange={onInputChange}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-200 outline-none"
            />
          ) : (
            <p className="text-slate-700">
              {(data as any)[field]}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
);
}

         