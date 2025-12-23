// API client for frontend - works with TanStack Query

const API_BASE = "/api"

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })
  return res.json()
}

// Auth API
export const authApi = {
  verifyUserId: (userId: string) =>
    request<{ exists: boolean }>("/auth/verify-user", {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),

  verifyPassword: (userId: string, password: string) =>
    request<{ user: { userId: string; name: string; role: string }; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ userId, password }),
    }),

  logout: () => request("/auth/logout", { method: "POST" }),

  getSession: () => request<{ user: { userId: string; name: string; role: string } | null }>("/auth/session"),
}

// DC API (placeholder for future)
export const dcApi = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    request<{ items: any[]; total: number }>(`/dc?${new URLSearchParams(params as any)}`),

  getById: (id: string) => request<any>(`/dc/${id}`),

  create: (data: any) =>
    request("/dc", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: any) =>
    request(`/dc/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    request(`/dc/${id}`, {
      method: "DELETE",
    }),
}
