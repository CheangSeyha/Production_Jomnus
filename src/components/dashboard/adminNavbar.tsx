import React from 'react';
import Image from 'next/image';
import { Search, Bell } from 'lucide-react';

const AdminHeader = () => {
    return (
        <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b border-gray-100 bg-white px-8">
            {/* Left: Logo Section */}
            <div className="flex items-center gap-3">
                <div className="relative flex h-20 w-40 items-center">
                    <Image
                        src="/images/logo.png"
                        alt="Logo"
                        width={200}
                        height={80}
                        className="h-auto w-30 rounded-md sm:w-30"
                    />
                </div>
            </div>

            {/* Right: Search and User Actions */}
            <div className="flex items-center gap-6">
                {/* Search Bar */}
                <div className="relative group">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="h-12 w-[400px] rounded-full bg-[#f1f4f9] pl-12 pr-4 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all border border-transparent focus:border-blue-200"
                    />
                </div>

                {/* Divider */}
                <div className="h-8 w-[1px] bg-gray-200" />

                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
                    <Bell className="h-6 w-6" />
                    {/* Optional notification dot */}
                    {/* <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span> */}
                </button>

                {/* User Profile */}
                <button className="flex items-center gap-2 rounded-full border-2 border-transparent hover:border-blue-100 transition-all overflow-hidden">
                    <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                        {/* Replace with your actual user image */}
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                            alt="User profile"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </button>
            </div>
        </header>
    );
};

export default AdminHeader;