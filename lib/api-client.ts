/**
 * External API Client for dc-server backend
 * Points to: http://localhost:3011
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3011';
// console.log("API_BASE_URL", API_BASE_URL)

interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    errors?: Record<string, string[]>;
}

class ExternalApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        // Initialize token from localStorage if available
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('accessToken');
        }
    }

    /**
     * Set authentication token
     */
    setToken(token: string) {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', token);
        }
    }

    /**
     * Clear authentication token
     */
    clearToken() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
        }
    }

    /**
     * Get authentication token
     */
    getToken(): string | null {
        return this.token;
    }

    /**
     * Make HTTP request
     */
    private async request<T = any>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}${endpoint}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        // Add authorization header if token exists
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle 401 Unauthorized - token expired
                if (response.status === 401) {
                    this.clearToken();
                    // Optionally redirect to login
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }

                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get<T = any>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'GET',
        });
    }

    /**
     * POST request
     */
    async post<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * PUT request
     */
    async put<T = any>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * DELETE request
     */
    async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            method: 'DELETE',
        });
    }

    // ============= Auth Methods =============

    /**
     * Login
     */
    async login(userId: string, password: string) {
        const response = await this.post('/api/auth/login', { userId, password });
        if (response.success && response.data?.accessToken) {
            this.setToken(response.data.accessToken);
            // Store refresh token if provided
            if (response.data.refreshToken && typeof window !== 'undefined') {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }
        }
        return response;
    }

    /**
     * Get current session
     */
    async getSession() {
        return this.get('/api/auth/session');
    }

    /**
     * Refresh access token using refresh token
     */
    async refreshToken() {
        const refreshToken = typeof window !== 'undefined'
            ? localStorage.getItem('refreshToken')
            : null;

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await this.post('/api/auth/refresh', { refreshToken });

        if (response.success && response.data?.accessToken) {
            this.setToken(response.data.accessToken);
            // Update refresh token if new one is provided
            if (response.data.refreshToken && typeof window !== 'undefined') {
                localStorage.setItem('refreshToken', response.data.refreshToken);
            }
        }

        return response;
    }

    /**
     * Setup (create first super admin)
     */
    async setup(userData: {
        userId: string;
        email: string;
        password: string;
        name: string;
    }) {
        return this.post('/api/auth/setup', userData);
    }

    /**
     * Create new user (requires admin/super_admin)
     */
    async createUser(userData: {
        userId: string;
        email: string;
        password: string;
        name: string;
        role?: 'super_admin' | 'admin' | 'user';
    }) {
        return this.post('/api/auth/create-user', userData);
    }

    /**
     * Logout
     */
    async logout() {
        try {
            // Call backend logout endpoint if token exists
            if (this.token) {
                await this.post('/api/auth/logout', {});
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear tokens locally
            this.clearToken();
            if (typeof window !== 'undefined') {
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
    }

    // ============= Suppliers Methods =============

    /**
     * Get all suppliers
     */
    async getSuppliers() {
        return this.get('/suppliers');
    }

    /**
     * Get supplier by ID
     */
    async getSupplier(id: string | number) {
        return this.get(`/suppliers/${id}`);
    }

    /**
     * Create supplier
     */
    async createSupplier(supplierData: any) {
        return this.post('/suppliers', supplierData);
    }

    /**
     * Update supplier
     */
    async updateSupplier(id: string | number, supplierData: any) {
        return this.put(`/suppliers/${id}`, supplierData);
    }

    /**
     * Delete supplier
     */
    async deleteSupplier(id: string | number) {
        return this.delete(`/suppliers/${id}`);
    }
}

// Export singleton instance
export const externalApi = new ExternalApiClient(API_BASE_URL);

// Export types
export type { ApiResponse };
