// NeonSquare/frontend/lib/api.ts
// --- Base URL normalization --------------------------------------------------
const rawEnv =
  (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE || '').trim();

// Allow comma-separated env values (pick the first non-empty one)
function firstNonEmpty(input: string): string {
  if (!input) return '';
  const parts = input.split(',').map(s => s.trim()).filter(Boolean);
  return parts.length ? parts[0] : '';
}

function normalizeBase(u: string) {
  if (!u) return 'http://localhost:8080/api';
  let v = u.replace(/\/+$/, '');
  if (!/\/api$/i.test(v)) v = v + '/api';
  return v;
}

function toIsoWithZ(x: string | undefined | null): string {
  if (!x) return new Date().toISOString();
  // If backend sends "yyyy-MM-ddTHH:mm:ss" (no zone), treat as UTC to avoid DST shifts
  if (/[zZ]$/.test(x) || /[+\-]\d\d:\d\d$/.test(x)) return x;
  return x + 'Z';
}

const API_BASE_URL = normalizeBase(firstNonEmpty(rawEnv));

// ----------------------------- Types ----------------------------------------
export type ReactionType = 'LIKE';

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

export interface Reaction {
  id: string;
  type: ReactionType;
  userId: string;
  user?: User | { id: string };
  createdAt?: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: string;
  author?: User;
  replies?: Comment[];
  parentCommentId?: string;
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

export interface AuthResponse {
  token: string | null;
  userId: string | null;            // backend sends UUID as string (or null on failure)
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  message: string | null;
  success: boolean;
}


// Minimal group types
export type GroupVisibility = 'PUBLIC' | 'PRIVATE' | 'PROTECTED';
export interface Group {
  id: string;
  name: string;
  description?: string;
  visibility: GroupVisibility | string;
  createdAt?: string;
  createdBy?: string;
  groupPicUrl?: string;
}

export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { firstName: string; lastName: string; email: string; password: string; }

// ----------------------------- Service --------------------------------------
export class ApiService {
  private baseURL: string;
  private token: string | null = null;
  private userId: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
      this.userId = localStorage.getItem('auth_user_id');
    }
  }

  private buildHeaders(body?: any, extra?: Record<string, string>) {
    const isFormData = body instanceof FormData;
    return {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(this.userId ? { 'X-User-Id': this.userId } : {}),
      ...(extra || {}),
    } as Record<string, string>;
  }

  /** Strict: throws on non-2xx */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(options.body, options.headers as Record<string, string>);
    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      try {
        const j = errorText ? JSON.parse(errorText) : null;
        const msg = j?.message ?? j?.error ?? errorText;
        throw new Error(msg || `HTTP ${res.status}`);
      } catch {
        throw new Error(errorText || `HTTP ${res.status}`);
      }
    }

    if (res.status === 204) return {} as T;

    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (ct.includes('application/json')) {
      return (await res.json()) as T;
    }
    const text = await res.text().catch(() => '');
    if (!text) return {} as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      return (text as unknown) as T;
    }
  }

  /** Lenient: returns parsed body even on non-2xx (never throws). */
  private async requestLenient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(options.body, options.headers as Record<string, string>);
    try {
      const res = await fetch(url, { ...options, headers });
      const ct = (res.headers.get('content-type') || '').toLowerCase();

      if (res.status === 204) return {} as T;
      if (ct.includes('application/json')) {
        return (await res.json()) as T;
      }
      const text = await res.text().catch(() => '');
      // Try to interpret text as JSON; otherwise fabricate a basic shape
      try {
        return JSON.parse(text) as T;
      } catch {
        return ({ success: res.ok, message: text || null } as unknown) as T;
      }
    } catch (e: any) {
      // Network/other failure: mimic a failed response shape
      return ({ success: false, message: e?.message || 'Network error' } as unknown) as T;
    }
  }

  // ----------------------------- Auth ---------------------------------------
  async login(credentials: { email: string; password: string }) {
    try {
      const res = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      // ALWAYS parse JSON (even for non-2xx)
      const body = await res.json().catch(() => ({}));

      // don't throw or console.error here — just return the body shape used by the form
      if (!res.ok) {
        return {
          success: false,
          message: body?.message ?? 'Invalid credentials',
          token: null, userId: null, firstName: null, lastName: null, email: null,
        };
      }

      if (body?.success && body.token) {
        this.setSession(body.token, String(body.userId));
      }
      return body;
    } catch (e: any) {
      return {
        success: false,
        message: e?.message || 'Network error',
        token: null, userId: null, firstName: null, lastName: null, email: null,
      };
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.requestLenient<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (response?.success && response.token) this.setSession(response.token, String(response.userId));
    return response;
  }

  async logout(): Promise<void> {
    this.token = null;
    this.userId = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user_id');
    }
  }

  // ----------------------------- Users --------------------------------------
  async searchUsers(query: string): Promise<User[]> {
    return this.request<User[]>(`/users/search?query=${encodeURIComponent(query)}`);
  }

  async getCurrentUser(): Promise<User> {
    if (this.getUserId()) {
      return this.getUser(this.userId as string);
    }
    return this.request<User>('/users/me');
  }

  async getUser(userId: string): Promise<User> {
    try {
      return await this.request<User>(`/users/${userId}`);
    } catch (error: any) {
      if (error?.message?.includes('404')) {
        return {
          id: userId,
          firstName: 'Unknown',
          lastName: 'User',
          email: 'unknown@example.com',
          profilePicUrl: undefined,
          status: 'OFFLINE' as any,
          isOnline: false,
          lastSeen: new Date().toISOString(),
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

  async uploadProfilePic(userId: string, file: File): Promise<User> {
    const fd = new FormData();
    fd.append('file', file);
    return this.request<User>(`/users/${userId}/profile-pic`, {
      method: 'POST',
      body: fd,
    });
  }

  // ----------------------------- Posts --------------------------------------
  async getPosts(): Promise<Post[]> {
    return this.request<Post[]>('/posts');
  }

  async createPost(text: string, userId: string, visibility: string = 'PUBLIC'): Promise<Post> {
    const formData = new FormData();
    formData.append('post', JSON.stringify({ text, userId, visibility }));
    return this.request<Post>('/posts', { method: 'POST', body: formData });
  }

  // ----------------------------- Reactions (LIKE) ---------------------------
  async getPostReactions(postId: string): Promise<Reaction[]> {
    const build = (raw: any[]): Reaction[] =>
      (Array.isArray(raw) ? raw : [])
        .map((r: any) => {
          const userId: string | undefined = (r?.userId ?? r?.user?.id);
          if (!userId) return null;
          return {
            id: String(r?.id ?? `${userId}-${r?.type ?? 'LIKE'}`),
            type: (r?.type ?? 'LIKE') as ReactionType,
            userId,
            user: r?.user ? r.user : { id: userId },
            createdAt: r?.createdAt,
          } as Reaction;
        })
        .filter(Boolean) as Reaction[];

    const headers = this.buildHeaders();

    // Primary endpoint
    try {
      const res = await fetch(`${this.baseURL}/posts/${encodeURIComponent(postId)}/reactions`, { headers });
      if (res.ok) {
        const data = await res.json().catch(() => []);
        return build(Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []));
      }
      if (res.status === 404) return [];
    } catch {}

    // Optional fallback #1
    try {
      const res2 = await fetch(`${this.baseURL}/reaction/post/${encodeURIComponent(postId)}`, { headers });
      if (res2.ok) {
        const data2 = await res2.json().catch(() => []);
        return build(Array.isArray(data2) ? data2 : (Array.isArray(data2?.data) ? data2.data : []));
      }
    } catch {}

    // Optional fallback #2
    try {
      const res3 = await fetch(`${this.baseURL}/posts/${encodeURIComponent(postId)}/likes`, { headers });
      if (res3.ok) {
        const data3 = await res3.json().catch(() => []);
        return build(Array.isArray(data3) ? data3 : (Array.isArray(data3?.data) ? data3.data : []));
      }
    } catch {}

    return [];
  }

  async addReaction(postId: string, type: ReactionType, userId: string): Promise<Reaction> {
    if (type !== 'LIKE') throw new Error('Only LIKE is supported');
    const r = await this.request<any>(`/posts/${postId}/like?userId=${encodeURIComponent(userId)}`, {
      method: 'PUT',
    });
    const id = String(r?.id ?? `temp-${Date.now()}`);
    return {
      id,
      type: (r?.type ?? 'LIKE') as ReactionType,
      userId: String(r?.userId ?? userId),
      user: { id: String(r?.userId ?? userId) },
      createdAt: r?.createdAt,
    };
  }

  async removeReaction(postId: string, userId: string): Promise<void> {
    await this.request<void>(`/posts/${postId}/like?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    });
  }

  // ----------------------------- Friendships --------------------------------
  async getFriends(userId: string): Promise<User[]> {
    const friendships = await this.request<any[]>(`/friendships/${userId}/accepted`);
    return (Array.isArray(friendships) ? friendships : [])
      .map((f) => (f?.sender?.id === userId ? f?.receiver : f?.sender))
      .filter((u): u is User => !!u && typeof u.id === 'string');
  }

  async getFriendRequests(userId: string): Promise<any[]> {
    return this.request<any[]>(`/friendships/${userId}/requests`);
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

  async acceptFriendRequest(requestId: string): Promise<void> {
    await this.request<void>(`/friendships/requests/${encodeURIComponent(requestId)}/accept`, {
      method: 'POST',
    });
  }

  async rejectFriendRequest(requestId: string): Promise<void> {
    await this.request<void>(`/friendships/requests/${encodeURIComponent(requestId)}`, {
      method: 'DELETE',
    });
  }

  /**
   * Return friendship state between a (me) and b (other) and the requestId when applicable.
   */
  async friendshipStateBetween(
    aId: string,
    bId: string
  ): Promise<{ state: 'ACCEPTED' | 'PENDING_OUT' | 'PENDING_IN' | 'NONE'; requestId?: string }> {
    try {
      const accepted = await this.request<any[]>(`/friendships/${aId}/accepted`);
      if (Array.isArray(accepted) && accepted.some(f =>
        (f?.sender?.id === aId && f?.receiver?.id === bId) ||
        (f?.sender?.id === bId && f?.receiver?.id === aId)
      )) return { state: 'ACCEPTED' };
    } catch {}

    try {
      const pendingA = await this.request<any[]>(`/friendships/${aId}/requests`);
      const inbound = Array.isArray(pendingA)
        ? pendingA.find(f => f?.sender?.id === bId && f?.receiver?.id === aId)
        : undefined;
      if (inbound?.id) return { state: 'PENDING_IN', requestId: String(inbound.id) };
    } catch {}

    try {
      const pendingB = await this.request<any[]>(`/friendships/${bId}/requests`);
      const outbound = Array.isArray(pendingB)
        ? pendingB.find(f => f?.sender?.id === aId && f?.receiver?.id === bId)
        : undefined;
      if (outbound?.id) return { state: 'PENDING_OUT', requestId: String(outbound.id) };
    } catch {}

    return { state: 'NONE' };
  }

  async findFriendRequestBetween(
    aId: string,
    bId: string
  ): Promise<{ requestId: string | null; direction: 'IN' | 'OUT' | null }> {
    const r = await this.friendshipStateBetween(aId, bId);
    if (r.state === 'PENDING_IN') return { requestId: r.requestId ?? null, direction: 'IN' };
    if (r.state === 'PENDING_OUT') return { requestId: r.requestId ?? null, direction: 'OUT' };
    return { requestId: null, direction: null };
  }

  // ----------------------------- Comments -----------------------------------
  async getComments(postId: string): Promise<Comment[]> {
    return this.request<Comment[]>(`/comment/post/${postId}/comments`);
  }

  async createComment(postId: string, content: string, userId: string): Promise<Comment> {
    const formData = new FormData();
    formData.append('comment', JSON.stringify({
      content,
      userId,
      createdAt: new Date().toISOString(),
    }));
    return this.request<Comment>(`/comment/${postId}/post`, { method: 'POST', body: formData });
  }

  async createReply(commentId: string, content: string, userId: string): Promise<Comment> {
    const formData = new FormData();
    formData.append('comment', JSON.stringify({
      content,
      userId,
      createdAt: new Date().toISOString(),
    }));
    return this.request<Comment>(`/comment/${commentId}/comment`, { method: 'POST', body: formData });
  }

  async getReplies(commentId: string): Promise<Comment[]> {
    return this.request<Comment[]>(`/comment/${commentId}/replies`);
  }

  // ----------------------------- Groups -------------------------------------
  async createGroup(
    name: string,
    description: string,
    visibility: string,
    userId: string
  ): Promise<Group> {
    return this.request<Group>('/groups', {
      method: 'POST',
      body: JSON.stringify({ name, description, visibility, createdBy: userId }),
    });
  }

  // ----------------------------- Chat ---------------------------------------
  async chatGetOrCreateConversation(user1: string, user2: string): Promise<{ id: string; userAId: string; userBId: string; }> {
    return this.request<{ id: string; userAId: string; userBId: string; }>(
      `/chat/conversations?user1=${encodeURIComponent(user1)}&user2=${encodeURIComponent(user2)}`,
      { method: 'POST' }
    );
  }

  async chatListConversations(userId: string): Promise<Array<{ id: string; userAId: string; userBId: string; }>> {
    return this.request<Array<{ id: string; userAId: string; userBId: string; }>>(
      `/chat/conversations/${encodeURIComponent(userId)}`
    );
  }

  async chatListMessages(conversationId: string, page = 0, size = 50): Promise<Array<{
    id: string; conversationId: string; senderId: string; content: string; sentAt: string; read: boolean;
  }>> {
    const arr = await this.request<Array<any>>(
      `/chat/${encodeURIComponent(conversationId)}/messages?page=${page}&size=${size}`
    );
    return (arr || []).map((m) => ({
      id: String(m.id),
      conversationId: String(m.conversationId),
      senderId: String(m.senderId),
      content: String(m.content ?? ''),
      sentAt: toIsoWithZ(m.sentAt),
      read: !!m.read,
    }));
  }

  async chatMarkRead(conversationId: string, userId: string): Promise<number> {
    return this.request<number>(`/chat/${encodeURIComponent(conversationId)}/read?userId=${encodeURIComponent(userId)}`, {
      method: 'POST',
    });
  }

  async chatPostMessage(conversationId: string, senderId: string, content: string): Promise<{
    id: string; conversationId: string; senderId: string; content: string; sentAt: string; read: boolean;
  }> {
    return this.request<{
      id: string; conversationId: string; senderId: string; content: string; sentAt: string; read: boolean;
    }>(
      `/chat/${encodeURIComponent(conversationId)}/messages?senderId=${encodeURIComponent(senderId)}&content=${encodeURIComponent(content)}`,
      { method: 'POST' }
    );
  }

  // ----------------------------- Session helpers ----------------------------
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') localStorage.setItem('auth_token', token);
  }

  setSession(token: string, userId: string): void {
    this.token = token;
    this.userId = userId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user_id', userId);
    }
  }

  getToken(): string | null { return this.token; }

  getUserId(): string | null {
    if (!this.userId && typeof window !== 'undefined') {
      this.userId = localStorage.getItem('auth_user_id');
    }
    return this.userId;
  }

  isAuthenticated(): boolean {
    if (this.token && (this.userId || typeof window === 'undefined')) return true;
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('auth_token');
      const storedUserId = localStorage.getItem('auth_user_id');
      if (storedToken && storedUserId) {
        this.token = storedToken;
        this.userId = storedUserId;
        return true;
      }
    }
    return false;
  }
}

export const apiService = new ApiService();
