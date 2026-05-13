"use client";

import React, { useState } from "react";
import { 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  Database, 
  Lock, 
  Users, 
  CreditCard,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Mail,
  Smartphone,
  Server
} from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "localization", label: "Localization", icon: Globe },
  { id: "platform", label: "Platform", icon: Server },
  { id: "billing", label: "Billing & Fees", icon: CreditCard },
  { id: "logs", label: "Audit Logs", icon: Database },
];

export default function AdminSettingPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Settings</h1>
            <p className="text-slate-500 mt-1">Configure global platform parameters and system preferences.</p>
          </div>
          <div className="flex items-center gap-3">
            {saveSuccess && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100"
              >
                <CheckCircle2 size={16} />
                <span className="text-sm font-bold">Changes saved!</span>
              </motion.div>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-200"
            >
              {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 ${
                  activeTab === tab.id 
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-200" 
                    : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
                }`}
              >
                <tab.icon size={20} className={activeTab === tab.id ? "text-indigo-600" : "text-slate-400"} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[32px] border border-slate-200/60 shadow-sm overflow-hidden"
            >
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="p-8 space-y-8">
                  <SectionTitle 
                    title="Platform Identity" 
                    description="Basic information about your platform visible to users." 
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Platform Name" defaultValue="Jomnus Marketplace" />
                    <InputField label="Support Email" defaultValue="support@jomnus.com" type="email" />
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Platform Description</label>
                      <textarea 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all h-32"
                        defaultValue="Leading on-demand service marketplace for professional performers and requesters."
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <label className="block text-sm font-bold text-slate-700 mb-4">Platform Logo</label>
                    <div className="flex items-center gap-6">
                      <div className="h-20 w-20 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300">
                        <Globe className="text-slate-400" />
                      </div>
                      <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                        Upload New Logo
                      </button>
                      <p className="text-xs text-slate-400">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === "security" && (
                <div className="p-8 space-y-8">
                  <SectionTitle 
                    title="Authentication & Security" 
                    description="Manage platform-wide security protocols and user access rules." 
                  />

                  <div className="space-y-4">
                    <ToggleItem 
                      title="Two-Factor Authentication (Required)" 
                      description="Force all administrative accounts to use 2FA."
                      checked={true}
                    />
                    <ToggleItem 
                      title="Password Complexity Rules" 
                      description="Enforce strong passwords (min 10 chars, symbols, numbers)."
                      checked={true}
                    />
                    <ToggleItem 
                      title="IP Rate Limiting" 
                      description="Prevent brute force attacks by limiting login attempts per IP."
                      checked={true}
                    />
                    <ToggleItem 
                      title="Maintenance Mode" 
                      description="Disable public access to the marketplace for scheduled updates."
                      checked={false}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <InputField label="Session Timeout (Minutes)" defaultValue="60" type="number" />
                    <InputField label="Max Login Attempts" defaultValue="5" type="number" />
                  </div>
                </div>
              )}

              {/* Platform Settings */}
              {activeTab === "platform" && (
                <div className="p-8 space-y-8">
                  <SectionTitle 
                    title="System Configuration" 
                    description="Advanced technical settings for platform operations." 
                  />

                  <div className="grid grid-cols-1 gap-6">
                    <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <Database size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Database Backup</p>
                          <p className="text-xs text-slate-500">Last backup: 2 hours ago (Auto-daily enabled)</p>
                        </div>
                      </div>
                      <button className="text-indigo-600 font-bold text-sm hover:underline">Run Now</button>
                    </div>

                    <div className="p-6 rounded-[24px] bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                          <Smartphone size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Push Notification Service</p>
                          <p className="text-xs text-slate-500">Firebase Cloud Messaging connected</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Active</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Settings */}
              {activeTab === "billing" && (
                <div className="p-8 space-y-8">
                  <SectionTitle 
                    title="Platform Economics" 
                    description="Define service fees and transaction parameters." 
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <InputField label="Service Fee (%)" defaultValue="15" type="number" />
                      <InputField label="Min. Task Budget ($)" defaultValue="5" type="number" />
                    </div>
                    <div className="space-y-6">
                      <InputField label="Min. Withdrawal Amount ($)" defaultValue="20" type="number" />
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-slate-700">Currency</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer">
                          <option value="USD">USD ($) - United States Dollar</option>
                          <option value="EUR">EUR (€) - Euro</option>
                          <option value="GBP">GBP (£) - British Pound</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-[24px] bg-indigo-50 border border-indigo-100 mt-4">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="text-indigo-600 mt-1" />
                      <div>
                        <p className="font-bold text-indigo-900">Tax Compliance</p>
                        <p className="text-sm text-indigo-700 mt-1">Changes to service fees will apply only to new tasks. Ongoing tasks will keep their original fee structure.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Audit Logs */}
              {activeTab === "logs" && (
                <div className="p-8 space-y-6">
                  <SectionTitle 
                    title="System Audit Logs" 
                    description="Track critical actions and system changes performed by administrators." 
                  />

                  <div className="space-y-4">
                    {[
                      { action: "Security Policy Updated", user: "Admin (Sokha)", time: "12 mins ago", type: "Security" },
                      { action: "New User Registration", user: "System", time: "45 mins ago", type: "User" },
                      { action: "Platform Fee Changed to 15%", user: "Admin (Dara)", time: "2 hours ago", type: "Billing" },
                      { action: "Database Auto-Backup Success", user: "System", time: "4 hours ago", type: "System" },
                      { action: "Identity Verification Approved", user: "Admin (Sokha)", time: "Yesterday", type: "Verification" },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-black ${
                            log.type === 'Security' ? 'bg-rose-100 text-rose-600' : 
                            log.type === 'User' ? 'bg-blue-100 text-blue-600' :
                            log.type === 'Billing' ? 'bg-amber-100 text-amber-600' :
                            'bg-slate-200 text-slate-600'
                          }`}>
                            {log.type[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{log.action}</p>
                            <p className="text-xs text-slate-500">Performed by <span className="font-medium text-slate-700">{log.user}</span></p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{log.time}</span>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-sm font-bold hover:border-indigo-200 hover:text-indigo-500 transition-all">
                    View All Activity Logs
                  </button>
                </div>
              )}

              {/* Footer Actions in Content */}
              <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                <button className="text-slate-400 hover:text-slate-600 text-sm font-bold px-6 py-2">
                  Discard Changes
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-black text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
    </div>
  );
}

function InputField({ label, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-slate-700">{label}</label>
      <input 
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
        {...props}
      />
    </div>
  );
}

function ToggleItem({ title, description, checked }: { title: string; description: string; checked: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
      <div className="flex-1 pr-4">
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <button className={`h-6 w-11 rounded-full transition-colors relative flex items-center ${checked ? 'bg-indigo-600' : 'bg-slate-300'}`}>
        <div className={`h-4 w-4 rounded-full bg-white shadow-sm transition-transform mx-1 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}
