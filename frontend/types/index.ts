// frontend/types/index.ts
// Common types used across the application

export interface User {
    id: string;
    fullName: string;
    email: string;
    password?: string;
    profilePic?: string;
    role: 'admin' | 'user' | 'moderator';
    bio?: string;
    location?: string;
    joinDate: Date;
    createdAt: Date;
    updatedAt: Date;
    isOnline?: boolean;
}

export interface Friendship {
    id: string;
    sender: User;
    receiver: User;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: Date;
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
    createdAt: Date;
    updatedAt: Date;
}

export interface Comment {
    id: string;
    postID: string;
    userID: string;
    user: User;
    text: string;
    reactions: Reaction[];
    editHistory: EditHistory[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Reaction {
    id: string;
    type: ReactionType;
    userID: string;
    user: User;
    postID?: string;
    commentID?: string;
    createdAt: Date;
}

export interface EditHistory {
    id: string;
    text: string;
    updatedAt: Date;
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
    createdAt: Date;
}

export interface GroupPost {
    id: string;
    groupID: string;
    group: Group;
    post: Post;
    createdAt: Date;
}

export interface Notification {
    id: string;
    userID: string;
    user: User;
    type: NotificationType;
    content: string;
    target?: string;
    status: 'new' | 'seen';
    createdAt: Date;
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
  time: string;
  isRead: boolean;
  conversationId: string;
}


// Enums
export type PostVisibility = 'public' | 'friends' | 'private';
export type GroupVisibility = 'public' | 'private';
export type NotificationType = 'friendRequest' | 'postUpdate' | 'groupCreation' | 'memberRequest';
export type ReactionType = 'like' | 'love' | 'laugh' | 'angry' | 'sad' | 'wow';

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
