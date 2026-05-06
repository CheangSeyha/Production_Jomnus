export type TaskBadge = {
  label: string;
  color: string;
};

export function getTaskBadges(task: {
  createdAt: string;
  deadline: string;
  price: number;
}) {
  const badges: TaskBadge[] = [];

  const now = new Date();
  const created = new Date(task.createdAt);
  const deadline = new Date(task.deadline);

  const diffCreatedHours =
    (now.getTime() - created.getTime()) / (1000 * 60 * 60);

  const diffDeadlineHours =
    (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (diffCreatedHours < 24) {
    badges.push({
      label: "New",
      color: "bg-green-100 text-green-600",
    });
  }

  if (diffDeadlineHours <= 2) {
    badges.push({
      label: "Urgent",
      color: "bg-red-100 text-red-600",
    });
  }

  if (task.price >= 50) {
    badges.push({
      label: "High Pay",
      color: "bg-yellow-100 text-yellow-700",
    });
  }

  if (diffDeadlineHours <= 6) {
    badges.push({
      label: "Quick",
      color: "bg-blue-100 text-blue-600",
    });
  }

  if (task.price <= 5) {
    badges.push({
      label: "Easy",
      color: "bg-purple-100 text-purple-600",
    });
  }

  return badges;
}