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

  async getTaskCompletions(taskId: number) {
    const response = await api.get(`/admin/tasks/${taskId}/completions`);
    return response.data;
  },

  // ============ VERIFICATIONS ============
  async getVerifications(params: PaginationParams = { page: 1, limit: 10 }) {
    const response = await api.get("/admin/verifications", { params });
    return response.data;
  },

  async approveVerification(verificationId: number) {
    const response = await api.patch(`/admin/verifications/${verificationId}/approve`);
    return response.data;
  },
};
