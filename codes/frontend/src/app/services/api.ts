const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestConfig extends RequestInit {
    token?: string;
}

class ApiService {
    private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...config.headers,
        };

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...config,
            headers,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || error.error || 'An error occurred');
        }

        return response.json();
    }

    async get<T>(endpoint: string, config: RequestConfig = {}) {
        return this.request<T>(endpoint, { ...config, method: 'GET' });
    }

    async post<T>(endpoint: string, data: any, config: RequestConfig = {}) {
        return this.request<T>(endpoint, {
            ...config,
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put<T>(endpoint: string, data: any, config: RequestConfig = {}) {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete(endpoint: string, config: RequestConfig = {}) {
        return this.request(endpoint, { ...config, method: 'DELETE' });
    }
}

export const api = new ApiService();
