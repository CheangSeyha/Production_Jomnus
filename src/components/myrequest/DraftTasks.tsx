"use client";

import { Clock, Trash2 } from "lucide-react";

type DraftTask = {
  id: string;
  title: string;
  createdAt?: string;
  category?: string;
};

type Props = {
  tasks?: DraftTask[];
  onDelete?: (id: string) => void;
};

export default function DraftTasks({ tasks = [], onDelete }: Props) {
  // Mock draft tasks for UI
  const defaultTasks: DraftTask[] = [
    {
      id: "1",
      title: "Copy Edit: Q3 Annual Review",
      createdAt: "2h ago",
    },
    {
      id: "2",
      title: "Blog Series: Future of FinTech",
      createdAt: "5h ago",
    },
  ];

  const displayTasks = tasks.length > 0 ? tasks : defaultTasks;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Draft Tasks</h3>
      <div className="space-y-3">
        {displayTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {task.title}
                </p>
                {task.createdAt && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <Clock size={12} />
                    <span>{task.createdAt}</span>
                  </div>
                )}
              </div>
              {onDelete && (
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 text-blue-600 text-sm font-medium hover:text-blue-700">
        View All Drafts
      </button>
    </div>
  );
}
