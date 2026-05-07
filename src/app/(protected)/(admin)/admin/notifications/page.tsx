"use client";

import { Bell } from "lucide-react";

export default function AdminNotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">
          Manage system notifications and alerts
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <Bell className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Notifications Hub
        </h2>
        <p className="text-gray-600 mb-4">
          This feature will show system notifications, alerts, and important updates.
        </p>
        <p className="text-sm text-gray-500">
          Currently, notifications are being processed in real-time through the system.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <p className="text-2xl font-bold text-blue-600">0</p>
            <p className="text-gray-600 text-sm">System Alerts</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-orange-200">
            <p className="text-2xl font-bold text-orange-600">0</p>
            <p className="text-gray-600 text-sm">Pending Actions</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="text-2xl font-bold text-green-600">0</p>
            <p className="text-gray-600 text-sm">Completed Tasks</p>
          </div>
        </div>
      </div>
    </div>
  );
}
