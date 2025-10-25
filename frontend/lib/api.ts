// frontend/lib/api.ts

// Normalize the configured base and ensure "/api" appears exactly once
const raw = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || '').trim();
function normalizeBase(u: string) {
    if (!u) return 'http://localhost:8080/api';
    // strip trailing slashes
    let v = u.replace(/\/+$/, '');
    // add /api if not present
    if (!/\/api$/i.test(v)) v = v + '/api';
    return v;
}

const API_BASE_URL = normalizeBase(raw);

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicUrl?: string;
    status?: string;
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
    updateAt?: string;
    imageUrls?: string[];
    commentCount?: number;
    reactionCount?: number;
}

export interface Comment {
    id: string;
    content: string;
    userId: string;
    postId: string;
    createdAt: string;
    author?: User; // Will be populated when needed
    replies?: Comment[]; // Nested replies
    parentCommentId?: string; // Reference to parent comment
}

export interface Reaction {
    id: string;
    type: ReactionType;
    user: User;
    createdAt: string;
}

export type ReactionType = 'LIKE';

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
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        // Don't set Content-Type for FormData, let browser set it with boundary
        const isFormData = options.body instanceof FormData;
        const config: RequestInit = {
            headers: {
                ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
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
            // Some endpoints return empty body; guard that
            const text = await response.text();
            return (text ? JSON.parse(text) : {}) as T;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Auth
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        if (response.success && response.token) this.setToken(response.token);
        return response;
    }

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        const response = await this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
        if (response.success && response.token) this.setToken(response.token);
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

    async getCurrentUser(): Promise<User> {
        return this.request<User>('/users/me');
    }

    async getUser(userId: string): Promise<User> {
        try {
            return await this.request<User>(`/users/${userId}`);
        } catch (error: any) {
            if (error.message.includes('404')) {
                // Return fallback user data when user not found
                return {
                    id: userId,
                    firstName: 'Unknown',
                    lastName: 'User',
                    email: 'unknown@example.com',
                    profilePicUrl: undefined,
                    status: 'OFFLINE' as any,
                    isOnline: false,
                    lastSeen: new Date().toISOString()
                };
            }
            throw error;
        }
    }

    async updateUser(userId: string, userData: Partial<User>): Promise<User> {
        return this.request<User>(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData),
        });
    }

    // Posts
    async getPosts(): Promise<Post[]> {
        return this.request<Post[]>('/posts');
    }

    async createPost(text: string, userId: string, visibility: string = 'PUBLIC'): Promise<Post> {
        const formData = new FormData();
        formData.append('post', JSON.stringify({
            text,
            userId,
            visibility,
        }));

        return this.request<Post>('/posts', {
            method: 'POST',
            body: formData,
        });
    }

    // Reactions
    async addReaction(postId: string, reactionType: ReactionType, userId: string): Promise<Reaction> {
        const formData = new FormData();
        formData.append('reaction', JSON.stringify({
            type: reactionType,
            userId: userId,
            createdAt: new Date().toISOString()
        }));

        return this.request<Reaction>(`/posts/${postId}/reaction`, {
            method: 'POST',
            body: formData,
        });
    }

    async removeReaction(postId: string, userId: string): Promise<void> {
        return this.request<void>(`/posts/${postId}/${userId}/delete`, {
            method: 'PATCH',
        });
    }

    async getPostReactions(postId: string): Promise<Reaction[]> {
        return this.request<Reaction[]>(`/posts/${postId}/reactions`);
    }


    // Friendship endpoints
    async getFriends(userId: string): Promise<User[]> {
        const friendships = await this.request<any[]>(`/friendships/${userId}/accepted`);
        return friendships.map(f => f.receiver || f.sender).filter(u => u.id !== userId);
    }

    async getFriendRequests(_userId: string): Promise<any[]> {
        return this.request<any[]>(`/friendships`);
    }

    async sendFriendRequest(senderId: string, receiverId: string): Promise<any> {
        return this.request<any>('/friendships', {
            method: 'POST',
            body: JSON.stringify({
                sender: { id: senderId },
                receiver: { id: receiverId },
                status: 'PENDING',
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

    // Groups
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

    // Comment endpoints
    async getComments(postId: string): Promise<Comment[]> {
        return this.request<Comment[]>(`/comment/post/${postId}/comments`);
    }

    async createComment(postId: string, content: string, userId: string): Promise<Comment> {
        const formData = new FormData();
        formData.append('comment', JSON.stringify({
            content,
            userId,
            createdAt: new Date().toISOString()
        }));

        return this.request<Comment>(`/comment/${postId}/post`, {
            method: 'POST',
            body: formData,
        });
    }

    async createReply(commentId: string, content: string, userId: string): Promise<Comment> {
        const formData = new FormData();
        formData.append('comment', JSON.stringify({
            content,
            userId,
            createdAt: new Date().toISOString()
        }));

        return this.request<Comment>(`/comment/${commentId}/comment`, {
            method: 'POST',
            body: formData,
        });
    }

    async getReplies(commentId: string): Promise<Comment[]> {
        return this.request<Comment[]>(`/comment/${commentId}/replies`);
    }

    // Notification endpoints (commented out until backend endpoints are ready)
    // async getNotifications(): Promise<any[]> {
    //     return this.request<any[]>('/notifications');
    // }

    // Utils
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
