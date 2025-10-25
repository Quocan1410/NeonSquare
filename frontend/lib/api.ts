const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicUrl?: string;
    isOnline: boolean;
    lastSeen: string;
}

export interface Post {
    id: string;
    text: string;
    author: User;
    comments: Comment[];
    reactions: Reaction[];
    visibility: string;
    updateAt: string;
    imageUrls: string[];
    commentCount: number;
    reactionCount: number;
}

export interface Comment {
    id: string;
    text: string;
    author: User;
    createdAt: string;
}

export interface Reaction {
    id: string;
    type: string;
    user: User;
}

export interface AuthResponse {
    token: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    message: string;
    success: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

class ApiService {
    private baseURL: string;
    private token: string | null = null;

    constructor() {
        this.baseURL = API_BASE_URL;
        // Get token from localStorage if available
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { Authorization: `Bearer ${this.token}` }),
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (response.success && response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });

        if (response.success && response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    async logout(): Promise<void> {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    }

    // User endpoints
    async searchUsers(query: string): Promise<User[]> {
        return this.request<User[]>(`/users/search?query=${encodeURIComponent(query)}`);
    }

    // Post endpoints
    async getPosts(): Promise<Post[]> {
        return this.request<Post[]>('/posts');
    }


    async createPost(text: string, userId: string, visibility: string = 'PUBLIC'): Promise<Post> {
        return this.request<Post>('/posts', {
            method: 'POST',
            body: JSON.stringify({
                text,
                userId,
                visibility,
            }),
        });
    }

    // Friendship endpoints
    async getFriends(userId: string): Promise<User[]> {
        const friendships = await this.request<any[]>(`/friendships/${userId}/accepted`);
        return friendships.map(f => f.receiver || f.sender).filter(u => u.id !== userId);
    }

    async getFriendRequests(userId: string): Promise<any[]> {
        return this.request<any[]>(`/friendships`);
    }

    async sendFriendRequest(senderId: string, receiverId: string): Promise<any> {
        return this.request<any>('/friendships', {
            method: 'POST',
            body: JSON.stringify({
                sender: { id: senderId },
                receiver: { id: receiverId },
                status: 'PENDING'
            }),
        });
    }

    async acceptFriendRequest(senderId: string, receiverId: string): Promise<void> {
        await this.request<void>('/friendships/accept', {
            method: 'POST',
            body: JSON.stringify({ senderId, receiverId }),
        });
    }

    async rejectFriendRequest(senderId: string, receiverId: string): Promise<void> {
        await this.request<void>('/friendships/delete', {
            method: 'DELETE',
            body: JSON.stringify({ senderId, receiverId }),
        });
    }

    // Group endpoints
    async getGroups(): Promise<any[]> {
        return this.request<any[]>('/groups');
    }

    async createGroup(name: string, description: string, visibility: string, userId: string): Promise<any> {
        return this.request<any>('/groups', {
            method: 'POST',
            body: JSON.stringify({
                name,
                description,
                visibility,
                userId,
            }),
        });
    }

    // Notification endpoints (commented out until backend endpoints are ready)
    // async getNotifications(): Promise<any[]> {
    //     return this.request<any[]>('/notifications');
    // }

    // Utility methods
    setToken(token: string): void {
        this.token = token;
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth_token', token);
        }
    }

    getToken(): string | null {
        return this.token;
    }

    isAuthenticated(): boolean {
        // Check both in-memory token and localStorage
        if (this.token) return true;
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('auth_token');
            if (storedToken) {
                this.token = storedToken;
                return true;
            }
        }
        return false;
    }
}

export const apiService = new ApiService();
