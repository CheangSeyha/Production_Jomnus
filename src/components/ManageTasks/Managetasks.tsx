"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

const tasks = [
  {
    title: "Grocery Delivery - Downtown",
    id: "ID: TSK-88219",
    requester: "Sarah Jenkins",
    price: "$25.00",
    status: "IN_PROGRESS",
    deadline: "Today, 6:00 PM",
  },
  {
    title: "Furniture Assembly (Desk)",
    id: "ID: TSK-88220",
    requester: "Mark Thompson",
    price: "$45.00",
    status: "POSTED",
    deadline: "Oct 12, 10:00 AM",
  },
  {
    title: "Garden Weeding & Cleanup",
    id: "ID: TSK-88221",
    requester: "Eleanor Vance",
    price: "$75.00",
    status: "COMPLETED",
    deadline: "Oct 10, 4:00 PM",
  },
  {
    title: "Spanish Tutoring (Intro)",
    id: "ID: TSK-88222",
    requester: "David Ruiz",
    price: "$30.00",
    status: "CANCELLED",
    deadline: "Oct 15, 2:00 PM",
  },
  {
    title: "Dog Walking (Park Run)",
    id: "ID: TSK-88223",
    requester: "Chloe Bell",
    price: "$18.00",
    status: "IN_PROGRESS",
    deadline: "Today, 5:30 PM",
  },
];

const statusColor = {
  POSTED: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-blue-100 text-blue-600",
  COMPLETED: "bg-green-100 text-green-600",
  CANCELLED: "bg-red-100 text-red-600",
};

export default function Managetasks() {
  return (
    <div className="bg-[#F4F8FC] min-h-screen p-6">

      {/* HEADER */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-[40px] font-bold text-[#1E1E1E]">
            Manage Tasks
          </h1>

          <p className="text-gray-500 mt-1 text-sm">
            Monitor and manage all community task activities.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-100 text-blue-600 rounded-[10px] text-sm font-medium">
            All Tasks
          </button>

          <button className="px-4 py-2 bg-white rounded-[10px] text-sm">
            My Actions
          </button>

          <button className="px-4 py-2 bg-white rounded-[10px] text-sm">
            Archived
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        {/* CARD 1 */}
        <div className="bg-[#005BFF] text-white rounded-[20px] p-6">
          <p className="uppercase text-xs tracking-widest opacity-80">
            Ongoing Impact
          </p>

          <h2 className="text-5xl font-bold mt-4">
            1,284
          </h2>

          <p className="text-sm opacity-80 mt-4">
            Active tasks across 14 categories this week
          </p>
        </div>

        {/* CARD 2 */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm">
          <p className="uppercase text-xs tracking-widest text-gray-500">
            Efficiency Rate
          </p>

          <h2 className="text-5xl font-bold mt-4">
            94.2%
          </h2>

          <p className="text-green-500 text-sm mt-4">
            + 2.4% from last month
          </p>
        </div>

        {/* CARD 3 */}
        <div className="bg-white rounded-[20px] p-6 shadow-sm">
          <p className="uppercase text-xs tracking-widest text-gray-500">
            Total Volume
          </p>

          <h2 className="text-5xl font-bold mt-4">
            $42.8k
          </h2>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex justify-between items-center mb-5">

        <div className="flex items-center gap-2">
          <span className="text-xs uppercase text-gray-400 mr-2">
            Quick Filters:
          </span>

          <button className="px-4 py-1 bg-gray-200 rounded-[10px] text-xs">
            POSTED
          </button>

          <button className="px-4 py-1 bg-blue-100 text-blue-600 rounded-[10px] text-xs">
            IN_PROGRESS
          </button>

          <button className="px-4 py-1 bg-gray-200 rounded-[10px] text-xs">
            COMPLETED
          </button>

          <button className="px-4 py-1 bg-gray-200 rounded-[10px] text-xs">
            CANCELLED
          </button>
        </div>

        <div className="flex gap-3">
          <button className="bg-white px-4 py-2 rounded-[10px] text-sm shadow-sm">
            Advanced Filters
          </button>

          <button className="bg-white px-4 py-2 rounded-[10px] text-sm shadow-sm">
            Export CSV
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[20px] overflow-hidden shadow-sm">

        <table className="w-full">

          <thead className="bg-[#FCFCFD] text-gray-500 text-sm">
            <tr>
              <th className="text-left px-6 py-4">TASK TITLE</th>
              <th className="text-left">REQUESTER</th>
              <th className="text-left">PRICE</th>
              <th className="text-left">STATUS</th>
              <th className="text-left">DEADLINE</th>
              <th className="text-left">ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task, index) => (
              <tr
                key={index}
                className="border-t border-gray-100 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <p className="font-semibold leading-5">
                    {task.title}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {task.id}
                  </p>
                </td>

                <td className="text-gray-700">
                  {task.requester}
                </td>

                <td className="font-semibold">
                  {task.price}
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-medium ${
                      statusColor[
                        task.status as keyof typeof statusColor
                      ]
                    }`}
                  >
                    {task.status}
                  </span>
                </td>

                <td className="text-gray-500">
                  {task.deadline}
                </td>

                <td>
                  <div className="flex gap-3 text-gray-500">
                    <Eye className="w-4 h-4 cursor-pointer hover:text-blue-500" />

                    <Pencil className="w-4 h-4 cursor-pointer hover:text-green-500" />

                    <Trash2 className="w-4 h-4 cursor-pointer hover:text-red-500" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-between items-center p-6 text-sm text-gray-500">
          <p>Showing 1 to 5 of 124 tasks</p>

          <div className="flex gap-2">
            <button className="w-9 h-9 rounded border border-gray-200 bg-white">
              {"<"}
            </button>

            <button className="w-9 h-9 rounded bg-blue-600 text-white">
              1
            </button>

            <button className="w-9 h-9 rounded border border-gray-200 bg-white">
              2
            </button>

            <button className="w-9 h-9 rounded border border-gray-200 bg-white">
              3
            </button>

            <button className="w-9 h-9 rounded border border-gray-200 bg-white">
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}