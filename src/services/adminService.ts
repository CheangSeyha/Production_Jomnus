import api from "@/lib/axios";

interface PaginationParams {
  page?: number;
  limit?: number;
}

export const adminService = {
  // ============ DASHBOARD ============
  async getDashboardStats() {
    const response = await api.get("/admin/dashboard/stats");
    return response.data;
  },

  // ============ USERS ============
  async getUsers(params: PaginationParams = { page: 1, limit: 10 }) {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  async deleteUser(userId: number) {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // ============ TASKS ============
  async getTasks() {
    const response = await api.get("/admin/tasks");
    return response.data;
  },

  async getTaskById(taskId: number) {
    const response = await api.get(`/admin/tasks/${taskId}`);
    return response.data;
  },

  async deleteTask(taskId: number) {
    const response = await api.delete(`/admin/tasks/${taskId}`);
    return response.data;
  },

  // ============ APPLICATIONS ============
  async getApplications(params: PaginationParams = { page: 1, limit: 10 }) {
    const response = await api.get("/admin/applications", { params });
    return response.data;
  },

  async getTaskApplications(taskId: number) {
    const response = await api.get(`/admin/tasks/${taskId}/applications`);
    return response.data;
  },

  // ============ ASSIGNMENTS ============
  async getAssignments(params: PaginationParams = { page: 1, limit: 10 }) {
    const response = await api.get("/admin/assignments", { params });
    return response.data;
  },

  // ============ IDENTITY VERIFICATIONS ============
  async getVerifications(params: PaginationParams = { page: 1, limit: 10 }) {
    const response = await api.get("/admin/verifications", { params });
    return response.data;
  },

  async approveVerification(id: number, adminId?: number) {
    // Passes transaction context payloads directly through the request body
    const response = await api.patch(`/admin/verifications/${id}/approve`, { adminId });
    return response.data;
  },

  async rejectVerification(id: number, payload: { reason: string; adminId?: number }) {
    const response = await api.patch(`/admin/verifications/${id}/reject`, payload);
    return response.data;
  },

  async resetVerificationToPending(id: number, adminId?: number) {
    const response = await api.patch(`/admin/verifications/${id}/reset`, { adminId });
    return response.data;
  },

  // ============ CSV EXPORT METHOD ============
  async exportVerificationsToCsv() {
    try {
      const response = await api.get("/admin/verifications/export", {
        responseType: "text"
      });

      if (typeof response.data === "string" && response.data.startsWith("{")) {
        const parsed = JSON.parse(response.data);
        if (parsed.statusCode >= 400) throw new Error(parsed.message || "Failed to download export");
      }

      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `identity_verifications_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export download processing encountered an issue:", error);
      throw error;
    }
  },
};