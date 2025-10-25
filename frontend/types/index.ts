// NeonSquare/frontend/types/index.ts
// Common types used across the application — resilient to multiple backend shapes.

export interface User {
  id: string;

  // Names: backend sends firstName/lastName, some UIs expect fullName.
  firstName?: string;
  lastName?: string;
  fullName?: string;

  email?: string;

  // Avatar: backend exposes profilePicUrl; some code still uses profilePic.
  profilePicUrl?: string;
  profilePic?: string;

  // Optional extras used by parts of the UI
  role?: 'admin' | 'user' | 'moderator';
  bio?: string;
  location?: string;
  status?: string;

  // Online state
  isOnline?: boolean;
  lastSeen?: string;

  // Timestamps often come as ISO strings from APIs
  joinDate?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Friendship {
  id: string;
  sender: User;
  receiver?: User;
  // Accept both UI and backend enum spellings
  status: 'pending' | 'accepted' | 'declined' | 'PENDING' | 'ACCEPTED' | 'DECLINED' | string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Post {
  id: string;
  text: string;
  userID: string;
  user: User;
  images?: string[];
  visibility: PostVisibility;
  reactions: Reaction[];
  comments: Comment[];
  editHistory: EditHistory[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Comment {
  id: string;
  postID: string;
  userID: string;
  user: User;
  text: string;
  reactions: Reaction[];
  editHistory: EditHistory[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type ReactionType = 'like' | 'LIKE' | 'LOVE' | string;

export interface Reaction {
  id: string;
  type: ReactionType;
  // Prefer camelCase, keep legacy Pascal-case for tolerance
  userId?: string;
  userID?: string;
  user: User;
  postID?: string;
  commentID?: string;
  createdAt: string | Date;
}

export interface EditHistory {
  id: string;
  text: string;
  updatedAt: string | Date;
  postID?: string;
  commentID?: string;
}

export interface Group {
  id: string;
  name: string;
  groupPicture?: string;
  visibility: GroupVisibility;
  members: User[];
  admins: User[];
  status: 'pending' | 'accepted';
  createdAt: string | Date;
}

export interface GroupPost {
  id: string;
  groupID: string;
  group: Group;
  post: Post;
  createdAt: string | Date;
}

export interface Notification {
  id: string;
  userID: string;
  user: User;
  type: NotificationType;
  content: string;
  target?: string;
  status: 'new' | 'seen';
  createdAt: string | Date;
}

export interface Conversation {
  id: string;
  user: Partial<User>;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  time: string; // ISO string
  isRead: boolean;
  conversationId: string;
}

/** Chat message payload over STOMP (interoperable with older/newer shapes) */
export interface ChatMessage {
  conversationId: string;
  /** preferred new field */
  fromUserId?: string;
  /** legacy/alternate field used by some UI code */
  senderId?: string;
  toUserId?: string;
  content: string;
  sentAt?: string; // ISO
  /** optional fields some UIs rely on for optimistic rendering */
  id?: string;
  read?: boolean;

  // NEW: lets the server echo map back to the optimistic bubble
  tempId?: string;
}

// Enums
export type PostVisibility = 'public' | 'friends' | 'private';
export type GroupVisibility = 'public' | 'private';

/** Align UI values with your backend enum names where you display them */
export type NotificationType =
  | 'FRIEND_REQUEST'
  | 'FRIEND_ACCEPTED'
  | 'COMMENT'
  | 'MENTION'
  | 'LIKE';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
}

// Navigation types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
}
